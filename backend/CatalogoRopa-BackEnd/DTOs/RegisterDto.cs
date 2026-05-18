using System.ComponentModel.DataAnnotations;

namespace CatalogoRopa_BackEnd.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string Nombre { get; set; } = string.Empty;
        public string? Apellido { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Contrasena { get; set; } = string.Empty;

        public string? Telefono { get; set; }
    }
}
