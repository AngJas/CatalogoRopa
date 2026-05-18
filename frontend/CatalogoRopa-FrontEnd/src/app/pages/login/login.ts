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

  control(name: string) {
    return this.form.get(name);
  }

  isInvalid(name: string) {
    const c = this.control(name);
    return c && c.invalid && (c.touched || c.dirty);
  }

  getErrorMessage(name: string) {
    const c = this.control(name);
    if (!c || !c.errors) return null;
    if (c.errors['required']) return 'Este campo es requerido.';
    if (c.errors['email']) return 'Ingrese un email válido.';
    if (c.errors['minlength']) return `Mínimo ${c.errors['minlength'].requiredLength} caracteres.`;
    return 'Campo inválido.';
  }
}
