export interface CrearProductoModel {
  nombre: string;
  descripcion?: string;
  precioBase: number;
  genero?: string;
  material?: string;
  idMarca: number;
  idCategoria: number;
  idColeccion?: number | null;
  idPromocion?: number | null;
  imagenBase64?: string | null;
  tipoContenido?: string | null;
}