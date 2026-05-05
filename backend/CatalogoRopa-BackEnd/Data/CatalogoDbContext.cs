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

        public DbSet<Ropa> Ropa { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Ropa>()
                .Property(r => r.Precio)
                .HasPrecision(10, 2);
        }
    }
}