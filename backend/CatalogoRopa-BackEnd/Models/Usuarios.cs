using System.ComponentModel.DataAnnotations;

namespace CatalogoRopa_BackEnd.Models;

public class Usuarios
{
    [Key]
    public int IdUsuario { get; set; }

    public string Nombre { get; set; } = string.Empty;
    public string? Apellido { get; set; }
    public string Email { get; set; } = string.Empty;
    // Almacena la contraseña hasheada (SHA256)
    public string Contrasena { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public DateTime FechaRegistro { get; set; } = DateTime.Now;
    public bool EsAdmin { get; set; }
}