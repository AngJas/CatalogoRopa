import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  form: any;

  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private popup: PopupService) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^(?!\s*$).+/)]],
      apellido: [''],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+/)]],
      telefono: ['', [Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(15)]]
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
    if (c.errors['minlength']) return `Mínimo ${c.errors['minlength'].requiredLength} caracteres.`;
    if (c.errors['maxlength']) return `Máximo ${c.errors['maxlength'].requiredLength} caracteres.`;
    if (c.errors['email']) return 'Ingrese un email válido.';
    if (c.errors['pattern']) {
      if (name === 'telefono') return 'Sólo números (10-15 dígitos).';
      if (name === 'nombre') return 'Nombre no puede ser solo espacios.';
      if (name === 'contrasena') return 'La contraseña debe incluir mayúscula, minúscula, número y carácter especial.';
      return 'Formato inválido.';
    }
    return 'Campo inválido.';
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.popup.showError('Formulario inválido', 'Por favor corrige los campos en rojo');
      return;
    }
    this.error = '';
    const val = this.form.value as any;
    this.popup.showLoading('Registrando', 'Creando cuenta...');
    this.auth.register({ nombre: val.nombre, apellido: val.apellido, email: val.email, contrasena: val.contrasena, telefono: val.telefono })
      .subscribe({
        next: () => {
          this.popup.showSuccess('Registrado', 'Cuenta creada');
          setTimeout(() => {
            this.popup.hide();
            this.router.navigate(['/']);
          }, 1200);
        },
        error: (e) => {
          const msg = e?.error?.message || 'Error en el registro';
          this.popup.showError('Error', msg);
          setTimeout(() => this.popup.hide(), 3000);
        }
      });
  }
}
