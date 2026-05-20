using System.ComponentModel.DataAnnotations;

namespace CatalogoRopa_BackEnd.Models;

public class Favorito
{
    [Key]
    public int IdFavorito { get; set; }

    public int IdUsuario { get; set; }
    public int IdProducto { get; set; }
    public DateTime? FechaAgregado { get; set; } = DateTime.Now;

    public Usuarios? Usuario { get; set; }
    public Producto? Producto { get; set; }
}