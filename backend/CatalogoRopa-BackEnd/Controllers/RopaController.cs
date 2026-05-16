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

        var totalProductos = await _context.Producto.CountAsync();

        List<Producto> respuesta = [];

        if (todas == false)
        {
            respuesta = await _context.Producto
            .OrderBy(r => r.IdProducto)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        }

        else

        {
            respuesta = await _context.Producto
                .OrderBy(r => r.IdProducto)
                .ToListAsync();
        }
                                                         
        var resultado = new
        {
            TotalProductos = totalProductos,
            PaginaActual = page,
            TamanoPagina = pageSize,
            TotalPaginas = (int)Math.Ceiling((double)totalProductos / pageSize),
            Datos = respuesta.OrderByDescending (r=> r.FechaPublicacion)
        };

        return Ok(resultado);
    }
}