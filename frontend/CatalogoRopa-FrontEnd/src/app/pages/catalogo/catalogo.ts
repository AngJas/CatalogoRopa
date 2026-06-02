import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RopaService } from '../../services/ropa.service';
import { RespuestaRopa } from '../../models/RespuestaRopa';
import { RopaModel } from '../../models/ropa-model';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

  ropa: RopaModel[] = [];
  ropaFiltrada: RopaModel[] = [];

  cargando = true;
  seccionActual = 'inicio';
  esInicio = false;

  filtroTipo: number | null = null;
  filtroPrecio = '';

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
        this.aplicarFiltros();

        console.log('ROPA OBTENIDA Y FILTRADA:', this.ropaFiltrada);

        this.cargando = false;
        this.cd.detectChanges();
      },

      error: (error) => {
        console.error('ERROR AL OBTENER ROPA:', error);
        this.cargando = false;
      }
    });
  }

  get tituloCatalogo(): string {
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

    this.ropaFiltrada = resultado;
  }

  limpiarFiltros(): void {
    this.filtroTipo = null;
    this.filtroPrecio = '';
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

}