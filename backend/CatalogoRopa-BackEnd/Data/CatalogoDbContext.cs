using Microsoft.EntityFrameworkCore;
using CatalogoRopa_BackEnd.Models;

namespace CatalogoRopa_BackEnd.Data
{
    public class CatalogoDbContext : DbContext
    {
        public CatalogoDbContext(DbContextOptions<CatalogoDbContext> options)
            : base(options)
        {
        }

        public DbSet<Producto> Producto { get; set; }
        public DbSet<Marca> Marcas { get; set; }
        public DbSet<Categoria> Categoria { get; set; }
        public DbSet<Coleccion> Coleccion { get; set; }
        public DbSet<Promocion> Promocion { get; set; }
        public DbSet<ImagenProducto> ImagenProducto { get; set; }
        public DbSet<Variante> Variante { get; set; }
        public DbSet<Usuario> Usuario { get; set; }
        public DbSet<Favorito> Favorito { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Categoria>()
            .HasOne(c => c.CategoriaPadreNavigation)
            .WithMany(c => c.Subcategorias)
            .HasForeignKey(c => c.CategoriaPadre)
            .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Favorito>()
                .HasIndex(f => new { f.IdUsuario, f.IdProducto })
                .IsUnique();

            modelBuilder.Entity<Producto>()
                .HasOne(p => p.Marca)
                .WithMany(m => m.Productos)
                .HasForeignKey(p => p.IdMarca);

            modelBuilder.Entity<Producto>()
                .HasOne(p => p.Categoria)
                .WithMany(c => c.Productos)
                .HasForeignKey(p => p.IdCategoria);

            modelBuilder.Entity<Producto>()
                .HasOne(p => p.Coleccion)
                .WithMany(c => c.Productos)
                .HasForeignKey(p => p.IdColeccion);

            modelBuilder.Entity<Producto>()
                .HasOne(p => p.Promocion)
                .WithMany(p => p.Productos)
                .HasForeignKey(p => p.IdPromocion);
        }
    }
}




