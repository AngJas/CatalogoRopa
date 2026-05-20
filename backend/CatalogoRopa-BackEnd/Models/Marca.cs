using System.ComponentModel.DataAnnotations;

namespace CatalogoRopa_BackEnd.Models;

public class Marca
{
    [Key]
    public int IdMarca { get; set; }

    public string Nombre { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
    public string? Descripcion { get; set; }

    public ICollection<Producto> Productos { get; set; } = new List<Producto>();
}