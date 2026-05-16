using System.ComponentModel.DataAnnotations;
using CatalogoRopa_BackEnd.Models;

public class Producto
{
    [Key]
    public int IdProducto { get; set; }

    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public decimal PrecioBase { get; set; }
    public string? Genero { get; set; }
    public string? Material { get; set; }
    public DateTime FechaPublicacion { get; set; } = DateTime.Now;

    public int IdMarca { get; set; }
    public int IdCategoria { get; set; }
    public int? IdColeccion { get; set; }
    public int? IdPromocion { get; set; }

    public Marca? Marca { get; set; }
    public Categoria? Categoria { get; set; }
    public Coleccion? Coleccion { get; set; }
    public Promocion? Promocion { get; set; }

    public ICollection<ImagenProducto> Imagenes { get; set; } = new List<ImagenProducto>();
    public ICollection<Variante> Variantes { get; set; } = new List<Variante>();
    public ICollection<Favorito> Favoritos { get; set; } = new List<Favorito>();
}