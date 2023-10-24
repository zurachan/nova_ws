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
        public async Task<ResponseData> GetRoles()
        {
            if (_context.Roles == null)
            {
                return new ResponseData { Success = false, Message = "Empty" };
            }

            return new ResponseData { Success = true, Data = await _context.Roles.ToListAsync() };
        }

        // GET: api/Roles/5
        [HttpGet("{id}")]
        public async Task<ResponseData> GetRole(int id)
        {
            if (_context.Roles == null)
            {
                return new ResponseData { Success = false, Message = "Empty" };
            }
            var role = await _context.Roles.FindAsync(id);

            if (role == null)
            {
                return new ResponseData { Success = false, Message = "Not found" };
            }

            return new ResponseData { Success = true, Data = role };
        }

        // PUT: api/Roles/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<ResponseData> PutRole(int id, Role role)
        {
            if (id != role.Id)
            {
                return new ResponseData { Success = false, Message = "Bad request" };
            }

            _context.Entry(role).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoleExists(id))
                {
                    return new ResponseData { Success = false, Message = "Not found" };
                }
                else
                {
                    throw;
                }
            }

            return new ResponseData { Success = true, Data = role }; ;
        }

        // POST: api/Roles
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ResponseData> PostRole(Role role)
        {
            if (_context.Roles == null)
            {
                return new ResponseData { Success = false, Message = "Empty" };
            }

            _context.Roles.Add(role);
            await _context.SaveChangesAsync();

            return new ResponseData { Success = true, Data = role };
        }

        // DELETE: api/Roles/5
        [HttpDelete("{id}")]
        public async Task<ResponseData> DeleteRole(int id)
        {
            if (_context.Roles == null)
            {
                return new ResponseData { Success = false, Message = "Empty" };
            }
            var role = await _context.Roles.FindAsync(id);
            if (role == null)
            {
                return new ResponseData { Success = false, Message = "Not found" };
            }

            role.IsDeleted = true;
            role.UpdatedDate = DateTime.Now;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoleExists(id))
                {
                    return new ResponseData { Success = false, Message = "Not found" };
                }
                else
                {
                    throw;
                }
            }

            return new ResponseData { Success = true };
        }

        private bool RoleExists(int id)
        {
            return (_context.Roles?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
