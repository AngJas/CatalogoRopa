import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RopaModel } from '../models/ropa-model';
import { RespuestaRopa } from '../models/RespuestaRopa';
import { CrearProductoModel } from '../models/Crear-Producto-Model';

@Injectable({
  providedIn: 'root',
})
export class RopaService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5260/api/Ropa';

  getRopa(
    page: number = 1,
    pageSize: number = 8, todas: boolean = false
  ): Observable<RespuestaRopa> {

    return this.http.get<RespuestaRopa>(
      `${this.apiUrl}?page=${page}&pageSize=${pageSize}&todas=${todas}`
    );
  }


  crearProducto(producto: CrearProductoModel): Observable <any> {
    return this.http.post<any>(this.apiUrl, producto);
  }

}
