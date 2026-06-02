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
            .Include(p => p.Categoria)
            .Include(p => p.Marca)
            .Include(p => p.Coleccion)
            .Include(p => p.Promocion)
            .Include(p => p.Variantes)
            .Include(p => p.Favoritos)
            .AsQueryable();

        var totalProductos = await query.CountAsync();

        // Materializar entidades primero para evitar que EF genere una subconsulta
        // que referencia columnas incorrectas en SQL (ProductoIdProducto)
        List<Producto> entidades;

        if (todas)
        {
            entidades = await query
                .OrderByDescending(p => p.FechaPublicacion)
                .ToListAsync();
        }
        else
        {
            entidades = await query
                .OrderByDescending(p => p.FechaPublicacion)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        var productos = entidades.Select(p => new
        {
            p.IdProducto,
            p.Nombre,
            p.Descripcion,
            p.PrecioBase,
            p.Genero,
            p.Material,
            p.FechaPublicacion,

            p.IdCategoria,
            Categoria = p.Categoria == null ? null : new
            {
                p.Categoria.IdCategoria,
                p.Categoria.Nombre
            },

            p.IdMarca,
            Marca = p.Marca == null ? null : new
            {
                p.Marca.IdMarca,
                p.Marca.Nombre
            },

            p.IdColeccion,
            Coleccion = p.Coleccion == null ? null : new
            {
                p.Coleccion.IdColeccion,
                p.Coleccion.Nombre
            },

            p.IdPromocion,
            Promocion = p.Promocion == null ? null : new
            {
                p.Promocion.IdPromocion,
                p.Promocion.Nombre
            },

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
            ,
            Variante = p.Variantes
                .Select(v => new
                {
                    v.IdVariante,
                    v.Talla,
                    v.Color,
                    v.Stock
                })
                .FirstOrDefault(),
            StockReal = p.Variantes.Select(v => v.Stock).FirstOrDefault(),
            CantidadFavoritos = p.Favoritos.Count(),
            Disponibles = Math.Max(0, p.Variantes.Select(v => v.Stock).FirstOrDefault() - p.Favoritos.Count())
        }).ToList();

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

        // Crear o actualizar variante asociada al producto (evitar duplicados)
        var variante = await _context.Variante
            .FirstOrDefaultAsync(v => v.IdProducto == producto.IdProducto);

        if (variante == null)
        {
            variante = new Variante
            {
                IdProducto = producto.IdProducto,
                Talla = dto.Talla,
                Color = dto.Color,
                Stock = dto.Stock
            };

            _context.Variante.Add(variante);
        }
        else
        {
            variante.Talla = dto.Talla;
            variante.Color = dto.Color;
            variante.Stock = dto.Stock;
        }

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

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProductoPorId(int id)
    {
        var producto = await _context.Producto
            .Include(p => p.Imagenes)
            .Include(p => p.Variantes)
            .Include(p => p.Favoritos)
            .Include(p => p.Marca)
            .Include(p => p.Categoria)
            .Include(p => p.Coleccion)
            .Include(p => p.Promocion)
            .FirstOrDefaultAsync(p => p.IdProducto == id);

        if (producto == null)
            return NotFound();

        return Ok(new
        {
            producto.IdProducto,
            producto.Nombre,
            producto.Descripcion,
            producto.PrecioBase,
            producto.Genero,
            producto.Material,
            producto.FechaPublicacion,
            producto.IdMarca,
            producto.IdCategoria,
            producto.IdColeccion,
            producto.IdPromocion,
            Imagenes = producto.Imagenes.Select(i => new
            {
                i.IdImagen,
                i.ImagenBase64,
                i.TipoContenido,
                i.TextoAlternativo,
                i.Orden,
                i.EsPrincipal
            }).OrderBy(i => i.Orden).ToList(),
            Variante = producto.Variantes
                .Select(v => new
                {
                    v.IdVariante,
                    v.Talla,
                    v.Color,
                    v.Stock
                })
                .FirstOrDefault(),
            StockReal = producto.Variantes.Select(v => v.Stock).FirstOrDefault(),
            CantidadFavoritos = producto.Favoritos.Count(),
            Disponibles = Math.Max(0, producto.Variantes.Select(v => v.Stock).FirstOrDefault() - producto.Favoritos.Count())
        });
    }

    [HttpPost("favorito")]
    public async Task<IActionResult> AgregarFavorito([FromBody] Favorito dto)
    {
        if (dto == null || dto.IdProducto <= 0 || dto.IdUsuario <= 0)
            return BadRequest("Datos inválidos para favorito.");

        var producto = await _context.Producto
            .Include(p => p.Variantes)
            .Include(p => p.Favoritos)
            .FirstOrDefaultAsync(p => p.IdProducto == dto.IdProducto);

        if (producto == null)
            return NotFound();

        var stockReal = producto.Variantes.Select(v => v.Stock).FirstOrDefault();
        var cantidadFavoritos = producto.Favoritos.Count();
        var disponibles = Math.Max(0, stockReal - cantidadFavoritos);

        if (disponibles <= 0)
            return BadRequest("No hay unidades disponibles para apartar.");

        // Verificar que el usuario no tenga ya un favorito para este producto
        var existe = await _context.Favorito.AnyAsync(f => f.IdUsuario == dto.IdUsuario && f.IdProducto == dto.IdProducto);
        if (existe)
            return BadRequest("Ya tienes una unidad apartada de este producto.");

        var favorito = new Favorito
        {
            IdUsuario = dto.IdUsuario,
            IdProducto = dto.IdProducto,
            FechaAgregado = DateTime.Now
        };

        _context.Favorito.Add(favorito);
        await _context.SaveChangesAsync();

        return Ok(new { agregado = true });
    }

    [HttpDelete("favorito")]
    public async Task<IActionResult> EliminarFavorito([FromQuery] int idUsuario, [FromQuery] int idProducto)
    {
        if (idUsuario <= 0 || idProducto <= 0)
            return BadRequest("Parámetros inválidos.");

        var favorito = await _context.Favorito.FirstOrDefaultAsync(f => f.IdUsuario == idUsuario && f.IdProducto == idProducto);
        if (favorito == null)
            return NotFound();

        _context.Favorito.Remove(favorito);
        await _context.SaveChangesAsync();

        return Ok(new { eliminado = true });
    }

    [HttpGet("favorito/check")]
    public async Task<IActionResult> CheckFavorito([FromQuery] int idUsuario, [FromQuery] int idProducto)
    {
        if (idUsuario <= 0 || idProducto <= 0)
            return BadRequest(new { existe = false });

        var existe = await _context.Favorito.AnyAsync(f => f.IdUsuario == idUsuario && f.IdProducto == idProducto);
        return Ok(new { existe = existe });
    }

    [HttpGet("lista")]
    public async Task<IActionResult> Lista(int page = 1, int pageSize = 20)
    {
        if (page <= 0) page = 1;
        if (pageSize <= 0) pageSize = 20;

        var query = _context.Producto
            .Include(p => p.Variantes)
            .Include(p => p.Favoritos)
            .AsQueryable();

        var total = await query.CountAsync();

        var datos = await query
            .OrderByDescending(p => p.FechaPublicacion)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new
            {
                p.IdProducto,
                p.Nombre,
                p.PrecioBase,
                p.Genero,
                p.Material,
                p.FechaPublicacion,
                Variante = p.Variantes
                    .Select(v => new
                    {
                        v.IdVariante,
                        v.Talla,
                        v.Color,
                        v.Stock
                    })
                    .FirstOrDefault(),
                StockReal = p.Variantes.Select(v => v.Stock).FirstOrDefault(),
                CantidadFavoritos = p.Favoritos.Count(),
                Disponibles = Math.Max(0, p.Variantes.Select(v => v.Stock).FirstOrDefault() - p.Favoritos.Count())
            })
            .ToListAsync();

        return Ok(new { Total = total, Page = page, PageSize = pageSize, Datos = datos });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> ActualizarProducto(int id, CrearProductoDto dto)
    {
        var producto = await _context.Producto
            .Include(p => p.Imagenes)
            .FirstOrDefaultAsync(p => p.IdProducto == id);

        if (producto == null)
            return NotFound();

        producto.Nombre = dto.Nombre;
        producto.Descripcion = dto.Descripcion;
        producto.PrecioBase = dto.PrecioBase;
        producto.Genero = dto.Genero;
        producto.Material = dto.Material;
        producto.IdMarca = dto.IdMarca;
        producto.IdCategoria = dto.IdCategoria;
        producto.IdColeccion = dto.IdColeccion;
        producto.IdPromocion = dto.IdPromocion;

        // Manejo simple de imagen: si se envía nueva imagen base64, actualizar la imagen principal si existe, sino agregarla
        if (!string.IsNullOrWhiteSpace(dto.ImagenBase64))
        {
            var imagenPrincipal = producto.Imagenes.FirstOrDefault(i => i.EsPrincipal == true) ?? producto.Imagenes.OrderBy(i => i.Orden).FirstOrDefault();

            if (imagenPrincipal != null)
            {
                imagenPrincipal.ImagenBase64 = dto.ImagenBase64;
                imagenPrincipal.TipoContenido = dto.TipoContenido ?? imagenPrincipal.TipoContenido;
                imagenPrincipal.TextoAlternativo = producto.Nombre;
            }
            else
            {
                var nueva = new ImagenProducto
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

                _context.ImagenProducto.Add(nueva);
            }
        }

        // Manejo de variante: crear si no existe, o actualizar
        var variante = await _context.Variante
            .FirstOrDefaultAsync(v => v.IdProducto == producto.IdProducto);

        if (variante == null)
        {
            variante = new Variante
            {
                IdProducto = producto.IdProducto
            };

            _context.Variante.Add(variante);
        }

        variante.Talla = dto.Talla;
        variante.Color = dto.Color;
        variante.Stock = dto.Stock;

        await _context.SaveChangesAsync();

        return Ok(new { producto.IdProducto });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> EliminarProducto(int id)
    {
        var producto = await _context.Producto
            .FirstOrDefaultAsync(p => p.IdProducto == id);

        if (producto == null)
            return NotFound();

        // Eliminar entidades relacionadas directamente por SQL para evitar excepciones si hay columnas NULL
        await _context.Database.ExecuteSqlInterpolatedAsync($"DELETE FROM ImagenProducto WHERE idProducto = {id}");
        await _context.Database.ExecuteSqlInterpolatedAsync($"DELETE FROM Variante WHERE idProducto = {id}");
        await _context.Database.ExecuteSqlInterpolatedAsync($"DELETE FROM Favorito WHERE idProducto = {id}");

        _context.Producto.Remove(producto);
        await _context.SaveChangesAsync();

        return Ok(new { eliminado = true, id = id });
    }


    [HttpGet("marcas")]
    public async Task<IActionResult> GetMarca()
    {
        var marcas = await _context.Marca
            .OrderBy(m => m.Nombre)
            .Select(m => new
            {
                m.IdMarca,
                m.Nombre,
            })
            .ToListAsync();
        return Ok(marcas);
    }

    [HttpGet("categorias")]
    public async Task<IActionResult> GetCategorias()
    {
        var categorias = await _context.Categoria
            .OrderBy(c => c.Nombre)
            .Select(c => new
            {
                c.IdCategoria,
                c.Nombre
            })
            .ToListAsync();

        return Ok(categorias);
    }


    [HttpGet("colecciones")]
    public async Task<IActionResult> GetColecciones()
    {
        var colecciones = await _context.Coleccion
            .OrderBy(c => c.Nombre)
            .Select(c => new
            {
                c.IdColeccion,
                c.Nombre
            })
            .ToListAsync();

        return Ok(colecciones);
    }

    [HttpGet("promociones")]
    public async Task<IActionResult> GetPromociones()
    {
        var promociones = await _context.Promocion
            .OrderBy(p => p.Nombre)
            .Select(p => new
            {
                p.IdPromocion,
                p.Nombre
            })
            .ToListAsync();

        return Ok(promociones);
    }




}