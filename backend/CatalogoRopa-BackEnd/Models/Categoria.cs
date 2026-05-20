using System.ComponentModel.DataAnnotations;

namespace CatalogoRopa_BackEnd.Models;

public class Categoria
{
    [Key]
    public int IdCategoria { get; set; }

    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }

    public int? CategoriaPadre { get; set; }

    public Categoria? CategoriaPadreNavigation { get; set; }
    public ICollection<Categoria> Subcategorias { get; set; } = new List<Categoria>();
    public ICollection<Producto> Productos { get; set; } = new List<Producto>();
}