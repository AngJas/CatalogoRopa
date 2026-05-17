using System.Runtime.InteropServices;

namespace CatalogoRopa_BackEnd.Models;

public class CrearProductoDto
{
    public string Nombre { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public decimal PrecioBase { get; set; }
    public string? Genero { get; set; }
    public string? Material { get; set; }

    public int IdMarca { get; set; }
    public int IdCategoria { get; set; }
    public int? IdColeccion { get; set; }
    public int? IdPromocion { get; set; }

    public string? ImagenBase64 { get; set; }
    public string? TipoContenido { get; set; }
}