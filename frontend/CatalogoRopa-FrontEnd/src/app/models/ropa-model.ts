export class RopaModel {
  idProducto?: number;
  nombre?: string;
  descripcion?: string;
  precioBase?: number;
  genero?: string;
  material?: string;
  fechaPublicacion?: string;

  idCategoria?: number;
  categoria?: {
    idCategoria?: number;
    nombre?: string;
  };

  idMarca?: number;
  marca?: {
    idMarca?: number;
    nombre?: string;
  };

  idColeccion?: number;
  coleccion?: {
    idColeccion?: number;
    nombre?: string;
  };

  idPromocion?: number | null;
  promocion?: {
    idPromocion?: number;
    nombre?: string;
  } | null;

  imagenes?: any[];
  // Variante (puede venir como 'variante' o 'Variante' desde el backend)
  variante?: {
    idVariante?: number;
    talla?: string;
    color?: string;
    stock?: number;
  };
  Variante?: {
    IdVariante?: number;
    Talla?: string;
    Color?: string;
    Stock?: number;
  };
}
