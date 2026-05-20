using System.ComponentModel.DataAnnotations;

namespace CatalogoRopa_BackEnd.Models;

public class Variante
{
    [Key]
    public int IdVariante { get; set; }

    public string? Talla { get; set; }
    public string? Color { get; set; }
    public int Stock { get; set; }
    public string? CodigoBarras { get; set; }

    public int IdProducto { get; set; }
    public Producto? Producto { get; set; }
}