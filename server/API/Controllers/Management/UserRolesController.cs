using API.Common;
using API.Domains;
using API.Domains.Management;
using API.Model.Management;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers.Management
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserRolesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        int UserId;
        public UserRolesController(AppDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            UserId = int.Parse(_httpContextAccessor.HttpContext?.User.FindFirstValue("UserId"));
        }

        // GET: api/UserRoles
        [HttpGet]
        public async Task<Response<List<UserRole>>> GetUserRoles()
        {
            if (_context.UserRoles == null)
            {
                return new Response<List<UserRole>> { Success = false, Message = "Empty" };
            }
            var domains = await _context.UserRoles.Where(x => !x.IsDeleted).ToListAsync();

            if (!domains.Any())
            {
                return new Response<List<UserRole>> { Success = false, Message = "Not found" };
            }

            return new Response<List<UserRole>>(domains);
        }

        [HttpGet("Role/{roleId}")]
        public async Task<Response<List<int>>> GetUsersByRole(int roleId)
        {
            if (_context.UserRoles == null)
            {
                return new Response<List<int>> { Success = false, Message = "Empty" };
            }
            var domains = await _context.UserRoles.Where(x => !x.IsDeleted && x.RoleId == roleId)
                .Select(x => x.UserId)
                .ToListAsync();

            if (!domains.Any())
            {
                return new Response<List<int>> { Success = false, Message = "Not found" };
            }

            return new Response<List<int>>(domains);
        }



        // POST: api/UserRoles
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<Response<bool>> PostUserRole(UserRoleModel model)
        {
            if (_context.UserRoles == null)
            {
                return new Response<bool> { Success = false, Message = "Empty" };
            }

            var userRoles = await _context.UserRoles.Where(x => !x.IsDeleted && x.RoleId == model.RoleId).ToListAsync();

            userRoles.ForEach(x =>
            {
                x.IsDeleted = true;
                x.UpdatedDate = DateTime.Now;
                x.UpdatedById = UserId;
            });

            if (model.UserId.Any())
            {
                model.UserId.ForEach(x =>
                {
                    UserRole entity = new()
                    {
                        UserId = x,
                        RoleId = model.RoleId,
                    };
                    _context.UserRoles.Add(entity);
                });
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return new Response<bool> { Success = false, Message = ex.Message };
            }

            return new Response<bool> { Success = true };
        }
    }
}
