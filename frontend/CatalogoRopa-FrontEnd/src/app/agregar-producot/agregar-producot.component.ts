
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RopaService } from '../services/ropa.service';
import { CrearProductoModel } from '../models/Crear-Producto-Model';


@Component({
  selector: 'app-agregar-producto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './agregar-producot.component.html',
  styleUrl: './agregar-producot.component.css'
})
export class AgregarProductoComponent {
  private fb = inject(FormBuilder);
  private ropaService = inject(RopaService);
  private router = inject(Router);

  imagenBase64: string | null = null;
  tipoContenido: string | null = null;
  vistaPrevia: string | null = null;
  guardando = false;
  error = '';

  formulario = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: [''],
    precioBase: [0, [Validators.required, Validators.min(1)]],
    genero: [''],
    material: [''],
    idMarca: [1, [Validators.required, Validators.min(1)]],
    idCategoria: [1, [Validators.required, Validators.min(1)]],
    idColeccion: [null as number | null],
    idPromocion: [null as number | null]
  });

  seleccionarImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];

    if (!archivo) return;

    this.tipoContenido = archivo.type || 'image/png';

    const reader = new FileReader();

    reader.onload = () => {
      const resultado = reader.result as string;
      this.vistaPrevia = resultado;
      this.imagenBase64 = resultado.split(',')[1];
    };

    reader.readAsDataURL(archivo);
  }

  guardarProducto(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valores = this.formulario.getRawValue();

    const producto: CrearProductoModel = {
      nombre: valores.nombre ?? '',
      descripcion: valores.descripcion ?? '',
      precioBase: Number(valores.precioBase),
      genero: valores.genero ?? '',
      material: valores.material ?? '',
      idMarca: Number(valores.idMarca),
      idCategoria: Number(valores.idCategoria),
      idColeccion: valores.idColeccion ? Number(valores.idColeccion) : null,
      idPromocion: valores.idPromocion ? Number(valores.idPromocion) : null,
      imagenBase64: this.imagenBase64,
      tipoContenido: this.tipoContenido
    };

    this.guardando = true;
    this.error = '';

    this.ropaService.crearProducto(producto).subscribe({
      next: () => {
        this.guardando = false;
        this.router.navigate(['/catalogo']);
      },
      error: (error) => {
        console.error(error);
        this.guardando = false;
        this.error = 'No se pudo guardar el producto. Revisa los datos ingresados.';
      }
    });
  }
}