
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RopaService } from '../services/ropa.service';
import { CrearProductoModel } from '../models/Crear-Producto-Model';
import { PopupService } from '../services/popup.service';


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
  private popup = inject(PopupService);
  private cd = inject(ChangeDetectorRef);

  imagenBase64: string | null = null;
  tipoContenido: string | null = null;
  vistaPrevia: string | null = null;
  guardando = false;
  error = '';
  buscarId = '';
  editingId: number | null = null;
  lastLoadedId: number | null = null;
  productos: any[] = [];
  loadingProductos = false;
  productosPage = 1;
  productosPageSize = 20;
  productosTotal = 0;

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

    if (this.editingId) {
      this.ropaService.actualizarProducto(this.editingId, producto).subscribe({
        next: () => {
          this.guardando = false;
          this.popup.showSuccess('Producto actualizado', 'El producto se actualizó correctamente');
          this.cargarProductos(this.productosPage);
        },
        error: (err) => {
          console.error(err);
          this.guardando = false;
          this.popup.showError('Error', 'No se pudo actualizar el producto.');
        }
      });
    } else {
      this.ropaService.crearProducto(producto).subscribe({
        next: () => {
          this.guardando = false;
          this.popup.showSuccess('Producto creado', 'El producto se creó correctamente');
          // limpiar formulario y vista previa
          this.formulario.reset({ idMarca: 1, idCategoria: 1, precioBase: 0 });
          this.imagenBase64 = null;
          this.tipoContenido = null;
          this.vistaPrevia = null;
          this.editingId = null;
          this.buscarId = '';
          this.lastLoadedId = null;
          this.cargarProductos(1);
        },
        error: (error) => {
          console.error(error);
          this.guardando = false;
          this.error = 'No se pudo guardar el producto. Revisa los datos ingresados.';
        }
      });
    }
  }

  limpiarFormulario(): void {
    this.formulario.reset({ idMarca: 1, idCategoria: 1, precioBase: 0 });
    this.imagenBase64 = null;
    this.tipoContenido = null;
    this.vistaPrevia = null;
    this.editingId = null;
    this.buscarId = '';
    this.lastLoadedId = null;
  }

  eliminarProducto(): void {
    if (!this.editingId) return;

    const id = this.editingId;
    this.popup.showLoading('Eliminando', 'Eliminando producto...');
    this.ropaService.eliminarProducto(id).subscribe({
      next: () => {
        this.popup.showSuccess('Eliminado', 'El producto fue eliminado');
        this.limpiarFormulario();
        this.cargarProductos(1);
      },
      error: (err) => {
        console.error(err);
        this.popup.showError('Error', 'No se pudo eliminar el producto.');
      }
    });
  }

  cargarProductos(page: number = 1): void {
    this.loadingProductos = true;
    this.ropaService.obtenerProductos(page, this.productosPageSize).subscribe({
      next: (res) => {
        const datos = res?.Datos ?? res?.datos ?? [];
        if (page === 1) {
          this.productos = datos;
        } else {
          this.productos = this.productos.concat(datos);
        }
        this.productosTotal = res?.Total ?? res?.total ?? this.productos.length;
        this.productosPage = page;
        this.loadingProductos = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loadingProductos = false;
        this.popup.showError('Error', 'No se pudieron cargar los productos');
      }
    });
  }

  cargarMas(): void {
    if (this.productos.length >= this.productosTotal) return;
    this.cargarProductos(this.productosPage + 1);
  }

  seleccionarDeTabla(producto: any): void {
    const id = producto?.IdProducto ?? producto?.idProducto;
    if (!id) return;
    this.buscarId = String(id);
    this.buscarProducto();
  }

  buscarProducto(): void {
    const id = Number(this.buscarId);
    if (!id || isNaN(id) || id <= 0) {
      this.popup.showError('ID inválido', 'Ingresa un número válido para IdProducto');
      return;
    }

    // Si ya cargamos ese mismo ID, evitar volver a consultar
    if (this.lastLoadedId === id) {
      return;
    }

    this.ropaService.getProductoPorId(id).subscribe({
      next: (res) => {
        if (!res) {
          this.limpiarFormulario();
          this.popup.showError('No encontrado', 'No existe un producto con ese Id');
          return;
        }

        // Mapear valores al formulario
        this.formulario.patchValue({
          nombre: res.nombre ?? res.Nombre ?? '',
          descripcion: res.descripcion ?? res.Descripcion ?? '',
          precioBase: res.precioBase ?? res.PrecioBase ?? 0,
          genero: res.genero ?? res.Genero ?? '',
          material: res.material ?? res.Material ?? '',
          idMarca: res.idMarca ?? res.IdMarca ?? 1,
          idCategoria: res.idCategoria ?? res.IdCategoria ?? 1,
          idColeccion: res.idColeccion ?? res.IdColeccion ?? null,
          idPromocion: res.idPromocion ?? res.IdPromocion ?? null
        });

        // imagen principal
        const imagenes = res.Imagenes ?? res.imagenes ?? [];
        if (imagenes.length > 0) {
          const principal = imagenes.find((i: any) => i.EsPrincipal || i.esPrincipal || i.EsPrincipal === true) || imagenes[0];
          if (principal && principal.ImagenBase64) {
            this.imagenBase64 = principal.ImagenBase64 ?? principal.imagenBase64;
            this.tipoContenido = principal.TipoContenido ?? principal.tipoContenido ?? 'image/png';
            this.vistaPrevia = `data:${this.tipoContenido};base64,${this.imagenBase64}`;
          }
        }

        this.editingId = id;
        this.lastLoadedId = id;
        this.popup.showInfo('Modo edición', 'Datos cargados. Ahora puedes actualizar el producto.');
      },
      error: (err) => {
        console.error(err);
        // Si el backend responde 404, limpiar el formulario
        const status = err?.status ?? err?.statusCode;
        if (status === 404) {
          this.limpiarFormulario();
          this.popup.showError('No encontrado', 'No existe un producto con ese Id');
        } else {
          this.popup.showError('Error', 'No se pudo consultar el producto.');
        }
      }
    });
  }

  constructor() {
    // keep default constructor-less injection style used by this component
  }

  ngOnInit(): void {
    this.cargarProductos(1);
  }
}
