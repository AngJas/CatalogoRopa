import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PopupService } from '../../services/popup.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  form: any;

  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private popup: PopupService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required]
    });
  }
//El metodo submit se encarga de procesar el inicio de sesión del usuario. Primero verifica si el formulario es válido, y si no lo es, 
// muestra un mensaje de error utilizando el servicio de popups. 
// Si el formulario es válido, muestra un popup de carga mientras se realiza la solicitud de inicio de sesión al servicio de autenticación.
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.popup.showError('Formulario inválido', 'Por favor corrige los campos en rojo');
      return;
    }

    this.error = '';
    const val = this.form.value as any;
    this.popup.showLoading('Iniciando sesión', 'Por favor espere...');
    this.auth.login({ email: val.email, contrasena: val.contrasena }).subscribe({
      next: () => {
        this.popup.showSuccess('Éxito', 'Sesión iniciada');
        setTimeout(() => {
          this.popup.hide();
          this.router.navigate(['/']);
        }, 1200);
      },
      error: (e) => {
        const msg = e?.error?.message || 'Error de login';
        this.popup.showError('Error', msg);
        setTimeout(() => this.popup.hide(), 3000);
      }
    });
  }

  //El metodo control se encarga de obtener el control del formulario para un campo especifico, 
//lo cual es necesario para verificar su estado de validacion y mostrar mensajes de error correspondientes en la interfaz de usuario.
  control(name: string) {
    return this.form.get(name);
  }


//El metodo isInvalid se encarga de verificar si un campo específico del formulario es inválido, 
// lo cual se determina si el campo tiene errores de validación y ha sido tocado o modificado por el usuario. 
// Esto es útil para mostrar mensajes de error o estilos de validación en la interfaz de usuario.
  isInvalid(name: string) {
    const c = this.control(name);
    return c && c.invalid && (c.touched || c.dirty);
  }



  /*El metodo getErrorMessage se encarga de obtener el mensaje de error para un campo específico cuando es inválido*/ 
  getErrorMessage(name: string) {
    const c = this.control(name);
    if (!c || !c.errors) return null;
    if (c.errors['required']) return 'Este campo es requerido.';
    if (c.errors['email']) return 'Ingrese un email válido.';
    if (c.errors['minlength']) return `Mínimo ${c.errors['minlength'].requiredLength} caracteres.`;
    return 'Campo inválido.';
  }
}
