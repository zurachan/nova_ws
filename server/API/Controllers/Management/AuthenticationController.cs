using API.Domains;
using API.Model.Management;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace API.Controllers.Management
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly AppDbContext _context;
        private IConfiguration _configuration;

        public AuthenticationController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("Login")]
        public AuthenResponse Login(AuthenRequest model)
        {
            try
            {
                var token = string.Empty;
                object resUser = new();
                object resRole = new();
                var success = false;
                var message = string.Empty;

                if (ModelState.IsValid)
                {
                    var user = _context.Users.FirstOrDefault(x => x.Username == model.Username && x.Password == model.Password);
                    if (user != null)
                    {
                        //create claims details based on the user information
                        var claims = new[] {
                        new Claim(JwtRegisteredClaimNames.Sub, _configuration["Jwt:Subject"]),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim("Username", user.Username),
                        new Claim("UserId", user.Id.ToString()),
                        };

                        var role = _context.UserRoles.Include(x => x.Role).Include(x => x.User).Where(x => x.User.Id == user.Id).ToList();

                        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                        var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                        var expiry = DateTime.Now.AddDays(Convert.ToInt32(_configuration["Jwt:ExpiryInDays"]));

                        var tokenDescriptor = new JwtSecurityToken(
                            _configuration["Jwt:Issuer"],
                            _configuration["Jwt:Audience"],
                            claims,
                            expires: expiry,
                            signingCredentials: signIn
                            );

                        token = new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
                        success = true;
                        resUser = user;
                        resRole = role;
                    }
                    else
                    {
                        message = "Username/ password không chính xác";
                    }
                }
                return new AuthenResponse { Success = success, Token = token, User = resUser, Role = resRole, Message = message };
            }
            catch (Exception ex)
            {
                return new AuthenResponse { Success = false, Message = ex.Message };
            }
        }
    }
}
