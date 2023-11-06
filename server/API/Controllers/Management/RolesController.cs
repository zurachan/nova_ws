using API.Common;
using API.Domains;
using API.Domains.Management;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers.Management
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RolesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Roles
        [HttpGet]
        public async Task<PagedResponse<List<Role>>> GetRoles()
        {
            //if (_context.Roles == null)
            //{
            //    return new Response { Success = false, Message = "Empty" };
            //}

            //return new Response { Success = true, Data = await _context.Roles.ToListAsync() };
            return null;
        }

        // GET: api/Roles/5
        [HttpGet("{id}")]
        public async Task<Response<Role>> GetRole(int id)
        {
            //if (_context.Roles == null)
            //{
            //    return new Response { Success = false, Message = "Empty" };
            //}
            //var role = await _context.Roles.FindAsync(id);

            //if (role == null)
            //{
            //    return new Response { Success = false, Message = "Not found" };
            //}

            //return new Response { Success = true, Data = role };
            return null;
        }

        // PUT: api/Roles/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<Response<Role>> PutRole(int id, Role role)
        {
            //if (id != role.Id)
            //{
            //    return new Response { Success = false, Message = "Bad request" };
            //}

            //var dbRole = await _context.Roles.FindAsync(id);
            //if (dbRole == null)
            //    return new Response { Success = false, Message = "Not found" };

            //dbRole.Name = role.Name;
            //dbRole.UpdatedDate = DateTime.Now;

            //try
            //{
            //    await _context.SaveChangesAsync();
            //}
            //catch (Exception ex)
            //{
            //    return new Response { Success = false, Message = ex.Message };
            //}

            //return new Response { Success = true, Data = dbRole };
            return null;
        }

        // POST: api/Roles
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<Response<Role>> PostRole(Role role)
        {
            //if (_context.Roles == null)
            //{
            //    return new Response { Success = false, Message = "Empty" };
            //}

            //_context.Roles.Add(role);
            //await _context.SaveChangesAsync();

            //return new Response { Success = true, Data = role };
            return null;
        }

        // DELETE: api/Roles/5
        [HttpDelete("{id}")]
        public async Task<Response<bool>> DeleteRole(int id)
        {
            //if (_context.Roles == null)
            //{
            //    return new Response { Success = false, Message = "Empty" };
            //}
            //var role = await _context.Roles.FindAsync(id);
            //if (role == null)
            //{
            //    return new Response { Success = false, Message = "Not found" };
            //}

            //role.IsDeleted = true;
            //role.UpdatedDate = DateTime.Now;

            //try
            //{
            //    await _context.SaveChangesAsync();
            //}
            //catch (Exception ex)
            //{
            //    return new Response { Success = false, Message = ex.Message };
            //}

            //return new Response { Success = true };
            return null;
        }
    }
}
