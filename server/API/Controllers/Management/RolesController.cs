using API.Common;
using API.Domains;
using API.Domains.Management;
using API.Model.SearchFilter;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers.Management
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        int UserId;

        public RolesController(AppDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            var value = _httpContextAccessor.HttpContext.User.FindFirstValue("UserId");
            UserId = value != null ? int.Parse(value) : 0;
        }

        // GET: api/Roles
        [HttpPost("search")]
        public async Task<PagedResponse<List<Role>>> GetRoles(RoleSearchParam param)
        {
            if (_context.Roles == null)
            {
                return new PagedResponse<List<Role>>(null) { Success = false };
            }
            var validFilter = new UserSearchParam(param.PageNumber, param.PageSize);

            var query = _context.Roles
                .Where(x => !string.IsNullOrEmpty(param.Role) ? !x.IsDeleted && x.Name.Contains(param.Role) : !x.IsDeleted)
                .OrderByDescending(x => x.Id);

            var pagedData = await query
                .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                .Take(validFilter.PageSize)
                .ToListAsync();

            var totalRecords = await query.CountAsync();
            var pagedReponse = PaginationHelper.CreatePagedReponse(pagedData, validFilter, totalRecords);
            return pagedReponse;
        }

        // GET: api/Roles/5
        [HttpGet("{id}")]
        public async Task<Response<Role>> GetRole(int id)
        {
            if (_context.Roles == null)
            {
                return new Response<Role> { Success = false, Message = "Empty" };
            }
            var domain = await _context.Roles.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);

            if (domain == null)
            {
                return new Response<Role> { Success = false, Message = "Not found" };
            }

            return new Response<Role>(domain);
        }

        // PUT: api/Roles/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<Response<Role>> PutRole(int id, Role model)
        {
            if (id != model.Id)
                return new Response<Role> { Success = false, Message = "Bad request" };

            var domain = _context.Roles.FirstOrDefault(x => x.Id == id && !x.IsDeleted);
            if (domain == null)
                return new Response<Role> { Success = false, Message = "Not found" };

            domain.Name = model.Name;

            domain.UpdatedDate = DateTime.Now;
            domain.UpdatedById = UserId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return new Response<Role> { Success = false, Message = ex.Message };
            }

            return new Response<Role>(domain);
        }

        // POST: api/Roles
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<Response<Role>> PostRole(Role model)
        {
            if (_context.Roles == null)
            {
                return new Response<Role> { Success = false, Message = "Empty" };
            }

            model.CreatedDate = DateTime.Now;
            model.CreatedById = UserId;
            _context.Roles.Add(model);
            await _context.SaveChangesAsync();

            return new Response<Role>(model);
        }

        // DELETE: api/Roles/5
        [HttpDelete("{id}")]
        public async Task<Response<Role>> DeleteRole(int id)
        {
            if (_context.Roles == null)
            {
                return new Response<Role> { Success = false, Message = "Empty" };
            }
            var domain = await _context.Roles.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
            if (domain == null)
            {
                return new Response<Role> { Success = false, Message = "Not found" };
            }

            domain.IsDeleted = true;
            domain.UpdatedDate = DateTime.Now;
            domain.UpdatedById = UserId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return new Response<Role> { Success = false, Message = ex.Message };
            }

            return new Response<Role> { Success = true };
        }
    }
}
