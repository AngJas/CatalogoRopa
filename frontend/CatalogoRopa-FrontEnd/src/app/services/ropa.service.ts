// Este servicio se encarga de manejar todas las operaciones relacionadas con la ropa, 
// como obtener la lista de productos, crear nuevos productos, actualizar productos existentes, eliminar productos y gestionar los favoritos de los usuarios.
// Utiliza HttpClient para comunicarse con la API RESTful en el backend, y define métodos para cada una de las operaciones necesarias. 
// Además, incluye métodos para obtener listas de marcas, categorías, colecciones y promociones, 
// que son útiles para llenar los formularios de creación y edición de productos.
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

// El método crearProducto se encarga de enviar una solicitud POST al backend para crear un nuevo producto de ropa.
  crearProducto(producto: CrearProductoModel): Observable <any> {
    return this.http.post<any>(this.apiUrl, producto);
  }

  //El metodo getProductoPorId se encarga de enviar una solicitud GET al backend para obtener los detalles de un producto específico utilizando su ID.
  getProductoPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  //El metodo actualizarProducto se encarga de enviar una solicitud PUT al backend para actualizar los detalles de un producto existente utilizando su ID y los nuevos datos del producto.
  actualizarProducto(id: number, producto: CrearProductoModel): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, producto);
  }

  //El metodoobtenerproductos se encarga de enviar una solicitud GET al backend para obtener una lista de productos de ropa, con soporte para paginación y un filtro opcional para incluir todos los productos o solo los activos.
  obtenerProductos(page: number = 1, pageSize: number = 20): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/lista?page=${page}&pageSize=${pageSize}`);
  }

  //El metodo eliminarProducto se encarga de enviar una solicitud DELETE al backend para eliminar un producto específico utilizando su ID.
  eliminarProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  
  //El metodo obtenerMarcas se encarga de enviar una solicitud GET al backend para obtener una lista de todas las marcas disponibles, lo cual es util
  //para llenar los formulario de creacion y edicion de productos.
  obtenerMarcas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/marcas`);
  }

  //El metodo obtenerCategorias se encarga de enviar una solicitud GET al backend para obtener una lista de todas las categorias disponibles, lo cual es util
  //para llenar los formulario de creacion y edicion de productos.
  obtenerCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categorias`);
  }

  //El metodo obtenerColecciones se encarga de enviar una solicitud GET al backend para obtener una lista de todas las colecciones disponibles, lo cual es util
  //para llenar los formulario de creacion y edicion de productos.
  obtenerColecciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/colecciones`);
  }

  //El metodo obtenerPromociones se encarga de enviar una solicitud GET al backend para obtener una lista de todas las promociones disponibles, lo cual es util
  //para llenar los formulario de creacion y edicion de productos.
  obtenerPromociones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/promociones`);
  }


  //El metodo addFavorito se encarga de enviar una solicitud POST al backend para agregar un producto a la lista de favoritos de un usuario específico, 
  // utilizando el ID del usuario y el ID del producto.
  addFavorito(payload: { idUsuario: number; idProducto: number }) {
    return this.http.post<any>(`${this.apiUrl}/favorito`, payload);
  }

  //El metodo removeFavorito se encarga de enviar una solicitud DELETE al backend para eliminar un producto de la lista de favoritos de un usuario específico,
  // utilizando el ID del usuario y el ID del producto.
  removeFavorito(idUsuario: number, idProducto: number) {
    return this.http.delete<any>(`${this.apiUrl}/favorito?idUsuario=${idUsuario}&idProducto=${idProducto}`);
  }

  //El metodo checkFavorito se encarga de enviar una solicitud GET al backend para verificar si un producto específico está marcado como favorito por un usuario específico,
  // utilizando el ID del usuario y el ID del producto. Esto es útil para mostrar el estado de favorito en la interfaz de usuario.
  checkFavorito(idUsuario: number, idProducto: number) {
    return this.http.get<any>(`${this.apiUrl}/favorito/check?idUsuario=${idUsuario}&idProducto=${idProducto}`);
  }


  //El metodo obtenerFavoritosPendientes se encarga de enviar una solicitud GET al backend para obtener una lista de productos que están marcados 
  // como favoritos por los usuarios pero que aún no han sido entregados, lo cual es útil para la sección de entregas pendientes en el panel de administración.
  obtenerFavoritosPendientes() {
    return this.http.get<any[]>(`${this.apiUrl}/favoritos/pendientes`);
  }

  //El metodo entregarFavorito se encarga de enviar una solicitud POST al backend para marcar un producto específico como entregado a un usuario específico,
  // utilizando el ID del usuario y el ID del producto. Esto es útil para actualizar el estado de los favoritos pendientes en la sección de entregas pendientes.
  entregarFavorito(idUsuario: number, idProducto: number) {
    return this.http.post<any>(`${this.apiUrl}/favorito/entregar?idUsuario=${idUsuario}&idProducto=${idProducto}`, {});
  }

  //Esta parte del codigo se necarga de definir las propiedades marcas, 
//categorias, colecciones y promociones, que son arrays que almacenan las listas de marcas, categorias, colecciones y promociones obtenidas del backend.
  marcas: any[] = [];
  categorias: any[] = [];
  colecciones: any[] = []
  promociones: any[] = [];



}




