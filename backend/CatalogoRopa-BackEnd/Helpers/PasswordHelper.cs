using System.Security.Cryptography;
using System.Text;

namespace CatalogoRopa_BackEnd.Helpers
{
    public static class PasswordHelper
    {
        // Hash a password using SHA256 and return hex string
        public static string Hash(string password)
        {
            using var sha = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha.ComputeHash(bytes);
            var sb = new StringBuilder();
            foreach (var b in hash)
                sb.Append(b.ToString("x2"));
            return sb.ToString();
        }
    }
}
