using System.ComponentModel.DataAnnotations;

namespace CatalogoRopa_BackEnd.Models;

public class Promocion
{
    [Key]
    public int IdPromocion { get; set; }

    public string Nombre { get; set; } = string.Empty;
    public string? Tipo { get; set; }
    public decimal? ValorDescuento { get; set; }
    public DateTime? FechaInicio { get; set; }
    public DateTime? FechaFin { get; set; }

    public ICollection<Producto> Productos { get; set; } = new List<Producto>();
}