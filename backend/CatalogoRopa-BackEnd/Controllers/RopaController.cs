using CatalogoRopa_BackEnd.Data;
using CatalogoRopa_BackEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CatalogoRopa_BackEnd.Controllers;
[AllowAnonymous]
[Route("api/[controller]")]
[ApiController]
public class RopaController : ControllerBase
{
    private readonly CatalogoDbContext _context;

    public RopaController(CatalogoDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetRopa(
        int page = 1,
        int pageSize = 8, bool todas=false)
    {
        if (page <= 0 && todas==false) 
            page = 1;

        if (pageSize <= 0 && todas==false)
            pageSize = 8;

        var query = _context.Producto
      .Include(p => p.Imagenes)
      .AsQueryable();

        var totalProductos = await query.CountAsync();

        var productos = todas
            ? await query
                .OrderByDescending(p => p.FechaPublicacion)
                .Select(p => new
                {
                    p.IdProducto,
                    p.Nombre,
                    p.Descripcion,
                    p.PrecioBase,
                    p.Genero,
                    p.Material,
                    p.FechaPublicacion,
                    Imagenes = p.Imagenes
                        .OrderBy(i => i.Orden)
                        .Select(i => new
                        {
                            i.IdImagen,
                            i.ImagenBase64,
                            i.TipoContenido,
                            i.TextoAlternativo,
                            i.Orden,
                            i.EsPrincipal
                        })
                        .ToList()
                })
                .ToListAsync()
            : await query
                .OrderByDescending(p => p.FechaPublicacion)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new
                {
                    p.IdProducto,
                    p.Nombre,
                    p.Descripcion,
                    p.PrecioBase,
                    p.Genero,
                    p.Material,
                    p.FechaPublicacion,
                    Imagenes = p.Imagenes
                        .OrderBy(i => i.Orden)
                        .Select(i => new
                        {
                            i.IdImagen,
                            i.ImagenBase64,
                            i.TipoContenido,
                            i.TextoAlternativo,
                            i.Orden,
                            i.EsPrincipal
                        })
                        .ToList()
                })
                .ToListAsync();

        var resultado = new
        {
            TotalProductos = totalProductos,
            PaginaActual = page,
            TamanoPagina = pageSize,
            TotalPaginas = todas ? 1 : (int)Math.Ceiling((double)totalProductos / pageSize),
            Datos = productos
        };

        return Ok(resultado);
    }


    [HttpPost]
    public async Task<IActionResult> CrearProducto(CrearProductoDto dto)
    {
        var producto = new Producto
        {
            Nombre = dto.Nombre,
            Descripcion = dto.Descripcion,
            PrecioBase = dto.PrecioBase,
            Genero = dto.Genero,
            Material = dto.Material,
            FechaPublicacion = DateTime.Now,
            IdMarca = dto.IdMarca,
            IdCategoria = dto.IdCategoria,
            IdColeccion = dto.IdColeccion,
            IdPromocion = dto.IdPromocion
        };

        _context.Producto.Add(producto);
        await _context.SaveChangesAsync();

        if (!string.IsNullOrWhiteSpace(dto.ImagenBase64))
        {
            var imagen = new ImagenProducto
            {
                Url = null,
                UrlMiniatura = null,
                TextoAlternativo = producto.Nombre,
                Orden = 1,
                EsPrincipal = true,
                IdProducto = producto.IdProducto,
                ImagenBase64 = dto.ImagenBase64,
                TipoContenido = dto.TipoContenido ?? "image/png"
            };

            _context.ImagenProducto.Add(imagen);
            await _context.SaveChangesAsync();
        }

        return Ok(new
        {
            producto.IdProducto,
            producto.Nombre,
            producto.Descripcion,
            producto.PrecioBase,
            producto.Genero,
            producto.Material,
            producto.FechaPublicacion
        });
    }

}