using System.ComponentModel.DataAnnotations;

namespace CatalogoRopa_BackEnd.Models;

public class ImagenProducto
{
    [Key]
    public int IdImagen { get; set; }

    public string Url { get; set; } = string.Empty;
    public string? UrlMiniatura { get; set; }
    public string? TextoAlternativo { get; set; }
    public int? Orden { get; set; }
    public bool EsPrincipal { get; set; }

    public int IdProducto { get; set; }
    public Producto? Producto { get; set; }
}