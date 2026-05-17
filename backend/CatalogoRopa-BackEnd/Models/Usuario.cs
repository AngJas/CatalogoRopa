using System.ComponentModel.DataAnnotations;

namespace CatalogoRopa_BackEnd.Models;

public class Usuario
{
    [Key]
    public int IdUsuario { get; set; }

    public string Nombre { get; set; } = string.Empty;
    public string? Apellido { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Contraseña { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public DateTime FechaRegistro { get; set; } = DateTime.Now;
    public string Estado { get; set; } = "Activo";
    public bool EsAdmin { get; set; }

    public ICollection<Favorito> Favoritos { get; set; } = new List<Favorito>();
}