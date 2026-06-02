import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';

interface AuthResponse {
  token: string;
  nombre: string;
  email: string;
  esAdmin: boolean;
}

//Este servicio se encarga de manejar la autenticacion de los usuarios en la aplicación, incluyendo el registro, i
// nicio de sesión, cierre de sesión y verificación del estado de autenticación.
//Utiliza HttpClient para comunicarse con la API RESTful en el backend, y Router para redirigir a los usuarios después de cerrar sesión. 
//El servicio mantiene el estado del usuario autenticado utilizando un BehaviorSubject, que permite a los componentes suscribirse a los cambios en el estado de autenticación.
@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5260/api';
  private userSubject = new BehaviorSubject<{ nombre: string; email: string; esAdmin: boolean } | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const user = localStorage.getItem('user');
    if (user) this.userSubject.next(JSON.parse(user));
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    const user = this.userSubject.getValue();
    return !!(user && user.esAdmin);
  }

  getUserId(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payload = JSON.parse(atob(parts[1]));
      const id = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload['nameid'] || payload['name'] || payload['sub'] || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
      
      //El token fue generado utilizando JWT (JSON Web Token), que es un formato común para tokens de autenticación.
      //El token se divide en tres partes: encabezado, carga útil y firma. La carga útil contiene la información del usuario, incluyendo el ID.
      //El método getUserId decodifica la carga útil del token para extraer el ID del usuario, que puede estar presente en diferentes campos dependiendo de cómo se haya configurado el backend.
      const nameId = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ?? payload['nameidentifier'] ?? payload['nameId'] ?? payload['nameidentifier'];
      const candidate = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ?? payload['nameidentifier'] ?? payload['nameid'] ?? payload['sub'];
      const parsed = Number(candidate);
      return isNaN(parsed) ? null : parsed;
    } catch {
      return null;
    }
  }
  
  register(payload: { nombre: string; apellido?: string; email: string; contrasena: string; telefono?: string }) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, payload).pipe(
      tap(res => this.saveAuth(res))
    );
  }

  login(payload: { email: string; contrasena: string }) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, payload).pipe(
      tap(res => this.saveAuth(res))
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/']);
  }

  private saveAuth(res: AuthResponse) {
    localStorage.setItem('token', res.token);
    const user = { nombre: res.nombre, email: res.email, esAdmin: res.esAdmin };
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }
}
