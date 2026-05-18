using Microsoft.AspNetCore.Mvc;
using CatalogoRopa_BackEnd.Data;
using CatalogoRopa_BackEnd.DTOs;
using CatalogoRopa_BackEnd.Models;
using CatalogoRopa_BackEnd.Helpers;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace CatalogoRopa_BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly CatalogoDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(CatalogoDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (await _context.Usuarios.AnyAsync(u => u.Email == dto.Email))
                return BadRequest(new { message = "El email ya está registrado." });

            var user = new Usuarios
            {
                Nombre = dto.Nombre,
                Apellido = dto.Apellido,
                Email = dto.Email,
                Contrasena = PasswordHelper.Hash(dto.Contrasena),
                Telefono = dto.Telefono,
                FechaRegistro = DateTime.Now,
                EsAdmin = false
            };

            _context.Usuarios.Add(user);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);

            var response = new AuthResponseDto
            {
                Token = token,
                Nombre = user.Nombre,
                Email = user.Email,
                EsAdmin = user.EsAdmin
            };

            return Ok(response);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null)
                return Unauthorized(new { message = "Credenciales inválidas." });

            var hashed = PasswordHelper.Hash(dto.Contrasena);
            if (!string.Equals(hashed, user.Contrasena))
                return Unauthorized(new { message = "Credenciales inválidas." });

            var token = GenerateJwtToken(user);

            var response = new AuthResponseDto
            {
                Token = token,
                Nombre = user.Nombre,
                Email = user.Email,
                EsAdmin = user.EsAdmin
            };

            return Ok(response);
        }

        private string GenerateJwtToken(Usuarios user)
        {
            var jwtSection = _config.GetSection("Jwt");
            var key = jwtSection.GetValue<string>("Key");
            var issuer = jwtSection.GetValue<string>("Issuer");
            var audience = jwtSection.GetValue<string>("Audience");
            var expiresMinutes = jwtSection.GetValue<int>("ExpiresMinutes");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.IdUsuario.ToString()),
                new Claim(ClaimTypes.Name, user.Nombre ?? string.Empty),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                new Claim("EsAdmin", user.EsAdmin.ToString())
            };

            var keyBytes = Encoding.UTF8.GetBytes(key);
            var securityKey = new SymmetricSecurityKey(keyBytes);
            var creds = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiresMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
