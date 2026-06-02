import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PopupService } from '../../services/popup.service';
import { RopaService } from '../../services/ropa.service';

@Component({
  selector: 'app-entregas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './entregas.html',
  styleUrls: ['./entregas.css']
})
export class EntregasComponent implements OnInit {
  private ropaService = inject(RopaService);
  private auth = inject(AuthService);
  private popup = inject(PopupService);
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);

  favoritosPendientes: any[] = [];
  cargando = true;

  ngOnInit(): void {
    if (!this.auth.isAdmin()) {
      this.router.navigate(['/']);
      return;
    }

    this.cargarFavoritosPendientes();
  }

  cargarFavoritosPendientes(): void {
    this.cargando = true;

    this.ropaService.obtenerFavoritosPendientes().subscribe({
      next: (favoritos: any[]) => {
        this.favoritosPendientes = favoritos ?? [];
        this.cargando = false;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar apartados:', error);
        this.cargando = false;
        this.popup.showError('Error', 'No se pudieron cargar los apartados por entregar.');
      }
    });
  }

  entregarFavorito(favorito: any): void {
    const idUsuario = favorito.idUsuario ?? favorito.IdUsuario;
    const idProducto = favorito.idProducto ?? favorito.IdProducto;

    if (!idUsuario || !idProducto) {
      this.popup.showError('Error', 'No se encontro informacion del apartado.');
      return;
    }

    this.ropaService.entregarFavorito(Number(idUsuario), Number(idProducto)).subscribe({
      next: () => {
        this.popup.showSuccess('Entregado', 'El apartado fue entregado y el stock se actualizo.');
        this.cargarFavoritosPendientes();
      },
      error: (error) => {
        console.error('Error al entregar apartado:', error);
        this.popup.showError('Error', 'No se pudo entregar el apartado.');
      }
    });
  }

  obtenerImagenUrl(favorito: any): string {
    const imagen = favorito.imagen ?? favorito.Imagen;
    const imagenBase64 = imagen?.imagenBase64 ?? imagen?.ImagenBase64;

    if (!imagenBase64) {
      return '';
    }

    if (imagenBase64.startsWith('data:image')) {
      return imagenBase64;
    }

    const tipo = imagen?.tipoContenido ?? imagen?.TipoContenido ?? 'image/png';
    return `data:${tipo};base64,${imagenBase64}`;
  }
}
