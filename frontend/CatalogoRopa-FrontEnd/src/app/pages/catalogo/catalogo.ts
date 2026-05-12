import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RopaService } from '../../services/ropa.service';
import { RespuestaRopa } from '../../models/RespuestaRopa';
import { RopaModel } from '../../models/ropa-model';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogo.html',
  styleUrls: ['./catalogo.css'],
})
export class CatalogoComponent implements OnInit {

  private ropaService = inject(RopaService);
  private cd = inject(ChangeDetectorRef);

  ropa: RopaModel[] = [];

  cargando = true;

  async ngOnInit(): Promise<void> {
    console.log('COMPONENTE INICIADO');

    this.ropaService.getRopa().subscribe({
      next: (respuesta: RespuestaRopa) => {

        console.log('RESPUESTA:', respuesta);

        this.ropa = respuesta.datos ?? [];

        console.log('ROPA FINAL:', this.ropa);

        this.cargando = false;
        this.cd.detectChanges();
      },

      error: (error) => {
        console.error(error);
        this.cargando = false;
      }
    });
  }
}
