namespace CatalogoRopa_BackEnd.Models
{
    public class Ropa
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string Descripcion { get; set; } = string.Empty;

        public decimal Precio { get; set; }

        public string Talla { get; set; } = string.Empty;

        public string Color { get; set; } = string.Empty;

        public string Categoria { get; set; } = string.Empty;

        public string ImagenBase64 { get; set; } = string.Empty;

        public int Stock { get; set; }

        public DateTime FechaRegistro { get; set; } = DateTime.Now;
    }
}