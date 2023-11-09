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

        // POST: api/UserRoles
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<Response<bool>> PostUserRole(UserRoleModel model)
        {
            if (_context.UserRoles == null)
            {
                return new Response<bool> { Success = false, Message = "Empty" };
            }

            var exitUserRole = await _context.UserRoles.FirstOrDefaultAsync(x => x.RoleId == model.RoleId && x.UserId == model.UserId && !x.IsDeleted);

            if (model.State)
            {
                if (exitUserRole == null)
                {
                    var entity = new UserRole
                    {
                        UserId = model.UserId,
                        RoleId = model.RoleId,
                        CreatedDate = DateTime.Now,
                        CreatedById = UserId,

                    };
                    _context.UserRoles.Add(entity);
                }
                else
                {
                    return new Response<bool> { Success = false, Message = "Duplicated" };
                }
            }
            else
            {
                if (exitUserRole == null)
                {
                    return new Response<bool> { Success = false, Message = "Not existed" };
                }
                else
                {
                    exitUserRole.IsDeleted = true;
                    exitUserRole.UpdatedDate = DateTime.Now;
                    exitUserRole.UpdatedById = UserId;
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return new Response<bool> { Success = false, Message = ex.Message };
            }

            return new Response<bool>();
        }
    }
}
