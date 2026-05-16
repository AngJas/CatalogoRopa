using CatalogoRopa_BackEnd.Data;
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
        int pageSize = 8)
    {
        if (page <= 0)
            page = 1;

        if (pageSize <= 0)
            pageSize = 8;

        var totalProductos = await _context.Ropa.CountAsync();

        var ropa = await _context.Ropa
            .OrderBy(r => r.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
                                                         
        var resultado = new
        {
            TotalProductos = totalProductos,
            PaginaActual = page,
            TamanoPagina = pageSize,
            TotalPaginas = (int)Math.Ceiling((double)totalProductos / pageSize),
            Datos = ropa
        };

        return Ok(resultado);
    }

    [HttpGet("prueba")]
    public async Task<IActionResult> GetPrueba()
    {
        var ropa = await _context.PRUEBA
            .OrderBy(r => r.DATOEQUISDE)
            .ToListAsync();

        return Ok(ropa);
    }
}