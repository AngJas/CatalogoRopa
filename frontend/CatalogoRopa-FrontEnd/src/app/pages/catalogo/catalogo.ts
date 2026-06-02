import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RopaService } from '../../services/ropa.service';
import { RespuestaRopa } from '../../models/RespuestaRopa';
import { RopaModel } from '../../models/ropa-model';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogo.html',
  styleUrls: ['./catalogo.css'],
})
export class CatalogoComponent implements OnInit {
  private ropaService = inject(RopaService);
  private cd = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  public auth = inject(AuthService);
  private popup = inject(PopupService);

  ropa: RopaModel[] = [];
  ropaFiltrada: RopaModel[] = [];

  cargando = true;
  seccionActual = 'inicio';
  esInicio = false;
  esAdmin = false;
  isLoggedIn = false;

  filtroTipo: number | null = null;
  filtroPrecio = '';
  mostrarSoloFavoritos = false;
  favoritosIds = new Set<number>();
  favoritosPendientes: any[] = [];
  cargandoFavoritosPendientes = false;

  opcionesTipo = [
  { etiqueta: 'Playeras', idCategoria: 1 },
  { etiqueta: 'Pantalones', idCategoria: 2 },
  { etiqueta: 'Vestidos', idCategoria: 3 },
  { etiqueta: 'Sudaderas', idCategoria: 4 },
  { etiqueta: 'Chamarras', idCategoria: 5 },
  { etiqueta: 'Faldas', idCategoria: 6 },
  { etiqueta: 'Camisas', idCategoria: 7 },
  { etiqueta: 'Blusas', idCategoria: 8 }
];

  opcionesPrecio = [
    { etiqueta: '$200 - $300', valor: '200-300' },
    { etiqueta: '$300 - $400', valor: '300-400' },
    { etiqueta: '$400 - $500', valor: '400-500' },
    { etiqueta: '$500 - $600', valor: '500-600' },
    { etiqueta: '$600 - $700', valor: '600-700' },
    { etiqueta: '$700 - $800', valor: '700-800' },
    { etiqueta: '$800 - $900', valor: '800-900' },
    { etiqueta: '$900 - $1000', valor: '900-1000' }
  ];

  async ngOnInit(): Promise<void> {
    console.log('INICIANDO COMPONENTE CATALOGO');

    this.route.paramMap.subscribe(params => {
      const seccion = params.get('seccion');

      this.esInicio = !seccion;
      this.seccionActual = seccion ?? 'inicio';

      this.limpiarFiltros();
      this.aplicarFiltros();
    });

    this.ropaService.getRopa(0, 0, true).subscribe({
      next: (respuesta: RespuestaRopa) => {
        console.log('RESPUESTA OBTENIDA DEL SERVICIO:', respuesta);

        this.ropa = respuesta.datos ?? [];
        this.favoritosIds.clear();
        this.ropa.forEach((it: any) => it.isFavorito = false);

        // Si el usuario estÃ¡ logueado, consultar cuÃ¡les productos ya tiene en favoritos
        if (this.auth.isLoggedIn()) {
          const idUsuario = this.auth.getUserId();
          if (idUsuario) {
            this.ropa.forEach((it: any) => {
              const idProducto = it.IdProducto ?? it.idProducto;
              if (!idProducto) return;
              this.ropaService.checkFavorito(idUsuario, idProducto).subscribe({
                next: (res: any) => {
                  it.isFavorito = !!(res?.existe ?? res?.Existe ?? res?.existe === true);
                  if (it.isFavorito) {
                    this.favoritosIds.add(Number(idProducto));
                  } else {
                    this.favoritosIds.delete(Number(idProducto));
                  }
                  this.aplicarFiltros();
                  this.cd.detectChanges();
                },
                error: () => {
                  it.isFavorito = false;
                }
              });
            });
          }
        }
        this.aplicarFiltros();

        console.log('ROPA OBTENIDA Y FILTRADA:', this.ropaFiltrada);

        this.cargando = false;
        // Determinar rol de usuario
        this.esAdmin = this.auth.isAdmin();
        this.isLoggedIn = this.auth.isLoggedIn();
        if (this.esAdmin) {
          this.cargarFavoritosPendientes();
        }
        this.cd.detectChanges();
      },

      error: (error) => {
        console.error('ERROR AL OBTENER ROPA:', error);
        this.cargando = false;
      }
    });
  }

  toggleFavorito(item: any): void {
    if (!this.auth.isLoggedIn()) {
      this.popup.showInfo('Inicia sesion', 'Debes iniciar sesion para agregar a favoritos');
      return;
    }

    const idUsuario = this.auth.getUserId();
    if (!idUsuario) {
      this.popup.showError('Error', 'No se encontro informacion del usuario en el token.');
      return;
    }

    const idProducto = item.IdProducto ?? item.idProducto;
    const disponibles = item.disponibles ?? item.Disponibles ?? 0;

    // If already favorited by this user, allow removal even if disponibles == 0
    if (item.isFavorito) {
      this.ropaService.removeFavorito(idUsuario, idProducto).subscribe({
        next: () => {
          this.popup.showSuccess('Removido', 'Producto removido de tus favoritos.');
          this.reloadRopaAndFavoritos();
        },
        error: () => this.popup.showError('Error', 'No se pudo remover el favorito.')
      });
      return;
    }

    // Otherwise (trying to add): enforce availability
    if (disponibles <= 0) {
      this.popup.showInfo('Agotado', 'No hay unidades disponibles para apartar.');
      return;
    }

    this.ropaService.addFavorito({ idUsuario, idProducto }).subscribe({
      next: () => {
        this.popup.showSuccess('Agregado', 'Producto agregado a tus favoritos.');
        this.reloadRopaAndFavoritos();
      },
      error: () => this.popup.showError('Error', 'No se pudo agregar a favoritos.')
    });
  }

  private reloadRopaAndFavoritos(): void {
    this.ropaService.getRopa(0, 0, true).subscribe((resp: any) => {
      this.ropa = resp.datos ?? [];
      this.favoritosIds.clear();
      this.ropa.forEach((it: any) => it.isFavorito = false);
      if (this.auth.isLoggedIn()) {
        const idUsuario = this.auth.getUserId();
        if (idUsuario) {
          this.ropa.forEach((it: any) => {
            const idProducto = it.IdProducto ?? it.idProducto;
            if (!idProducto) return;
            this.ropaService.checkFavorito(idUsuario, idProducto).subscribe({
              next: (res: any) => {
                it.isFavorito = !!(res?.existe ?? res?.Existe ?? res?.existe === true);
                if (it.isFavorito) {
                  this.favoritosIds.add(Number(idProducto));
                } else {
                  this.favoritosIds.delete(Number(idProducto));
                }
                this.aplicarFiltros();
                this.cd.detectChanges();
              },
              error: () => { it.isFavorito = false; }
            });
          });
        }
      }
      this.aplicarFiltros();
      this.cd.detectChanges();
    });
  }


  cargarFavoritosPendientes(): void {
    if (!this.auth.isAdmin()) {
      this.favoritosPendientes = [];
      return;
    }

    this.cargandoFavoritosPendientes = true;

    this.ropaService.obtenerFavoritosPendientes().subscribe({
      next: (favoritos: any[]) => {
        this.favoritosPendientes = favoritos ?? [];
        this.cargandoFavoritosPendientes = false;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar favoritos pendientes:', error);
        this.cargandoFavoritosPendientes = false;
        this.popup.showError('Error', 'No se pudieron cargar los apartados por entregar.');
      }
    });
  }

  entregarFavoritoPendiente(favorito: any): void {
    const idUsuario = favorito.idUsuario ?? favorito.IdUsuario;
    const idProducto = favorito.idProducto ?? favorito.IdProducto;

    if (!idUsuario || !idProducto) {
      this.popup.showError('Error', 'No se encontro informacion del apartado.');
      return;
    }

    this.ropaService.entregarFavorito(Number(idUsuario), Number(idProducto)).subscribe({
      next: () => {
        this.popup.showSuccess('Entregado', 'El apartado fue entregado y el stock se actualizo.');
        this.reloadRopaAndFavoritos();
        this.cargarFavoritosPendientes();
      },
      error: (error) => {
        console.error(error);
        this.popup.showError('Error', 'No se pudo entregar el apartado.');
      }
    });
  }  get tituloCatalogo(): string {
    if (this.esInicio) {
      return 'LO MAS NUEVO EN NUESTRO CATALOGO';
    }

    const titulos: Record<string, string> = {
      novedades: 'CATALOGO DE NOVEDADES',
      promociones: 'CATALOGO DE PROMOCIONES',
      hombre: 'CATALOGO PARA HOMBRE',
      mujer: 'CATALOGO PARA MUJER',
      todo: 'CATALOGO COMPLETO'
    };

    return titulos[this.seccionActual] ?? 'CATALOGO';
  }

  aplicarFiltros(): void {
    let resultado = [...this.ropa];

    resultado = resultado.filter(item => this.perteneceASeccion(item));

    if (this.filtroTipo !== null) {
      resultado = resultado.filter(item => item.idCategoria === this.filtroTipo);
    }

    if (this.filtroPrecio) {
      const [minimo, maximo] = this.filtroPrecio.split('-').map(Number);

      resultado = resultado.filter(item => {
        const precio = Number(item.precioBase ?? 0);
        return precio >= minimo && precio <= maximo;
      });
    }

    if (this.mostrarSoloFavoritos) {
      resultado = resultado.filter(item => {
        const idProducto = (item as any).idProducto ?? (item as any).IdProducto;
        return idProducto !== undefined &&
          idProducto !== null &&
          this.favoritosIds.has(Number(idProducto));
      });
    }

    this.ropaFiltrada = resultado;
  }

  limpiarFiltros(): void {
    this.filtroTipo = null;
    this.filtroPrecio = '';
    this.mostrarSoloFavoritos = false;
  }

  private perteneceASeccion(item: RopaModel): boolean {
    if (this.esInicio || this.seccionActual === 'inicio') {
      return true;
    }

    const genero = this.normalizar(item.genero);

    if (this.seccionActual === 'hombre') {
      return genero.includes('hombre') || genero.includes('masculino');
    }

    if (this.seccionActual === 'mujer') {
      return genero.includes('mujer') || genero.includes('femenino');
    }

    if (this.seccionActual === 'promociones') {
      return this.contieneTexto(item, 'promocion') ||
        this.contieneTexto(item, 'descuento') ||
        this.contieneTexto(item, 'oferta') ||
        Boolean((item as any).idPromocion || (item as any).promocion);
    }

    return true;
  }

  private contieneTexto(item: RopaModel, valor: string): boolean {
    const texto = [
      item.nombre,
      item.descripcion,
      item.genero,
      item.material,
      (item as any).categoria?.nombre,
      (item as any).promocion?.nombre
    ].join(' ');

    return this.normalizar(texto).includes(this.normalizar(valor));
  }

  private normalizar(valor: unknown): string {
    return String(valor ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  obtenerImagenUrl(imagen: any): string {
    if (!imagen?.imagenBase64) {
      return '';
    }

    if (imagen.imagenBase64.startsWith('data:image')) {
      return imagen.imagenBase64;
    }

    const tipo = imagen.tipoContenido || 'image/png';
    return `data:${tipo};base64,${imagen.imagenBase64}`;
  }


  seleccionarTipo(idCategoria: number): void {
    if (this.filtroTipo === idCategoria) {
      this.filtroTipo = null;
    }
    else {
      this.filtroTipo = idCategoria;
    }

    this.aplicarFiltros();
  }

  seleccionarPrecio(valor: string): void {
    if (this.filtroPrecio === valor) {
      this.filtroPrecio = '';
    }
    else {
      this.filtroPrecio = valor;
    }

    this.aplicarFiltros();
  }

  cambiarFiltroFavoritos(): void {
    this.mostrarSoloFavoritos = !this.mostrarSoloFavoritos;
    this.aplicarFiltros();
  }

}



