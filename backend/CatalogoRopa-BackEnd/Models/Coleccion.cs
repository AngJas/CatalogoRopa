using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CatalogoRopa_BackEnd.Models;

public class Coleccion
{
    [Key]
    public int IdColeccion { get; set; }

    public string Nombre { get; set; } = string.Empty;
    public string? Temporada { get; set; }

    [Column("año")]
    public int? Anio { get; set; }

    public DateTime? FechaInicio { get; set; }
    public DateTime? FechaFin { get; set; }

    public ICollection<Producto> Productos { get; set; } = new List<Producto>();
}