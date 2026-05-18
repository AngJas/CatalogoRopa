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
