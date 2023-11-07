using API.Common;
using API.Domains;
using API.Domains.Business;
using API.Domains.Management;
using API.Model.SearchFilter;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers.Business
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        int UserId;

        public ProjectsController(AppDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            UserId = int.Parse(_httpContextAccessor.HttpContext?.User.FindFirstValue("UserId"));
        }

        // GET: api/Projects
        [HttpPost("search")]
        public async Task<PagedResponse<List<Project>>> GetProjects(ProjectSearchParam param)
        {
            if (_context.Projects == null)
            {
                return new PagedResponse<List<Project>>(null) { Success = false };
            }
            var validFilter = new UserSearchParam(param.PageNumber, param.PageSize);

            var query = _context.Projects
                .Where(x => !string.IsNullOrEmpty(param.Project) ? !x.IsDeleted && x.Name.Contains(param.Project) : !x.IsDeleted)
                .OrderByDescending(x => x.Id);

            var pagedData = await query
                .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                .Take(validFilter.PageSize)
                .ToListAsync();

            var totalRecords = await query.CountAsync();
            var pagedReponse = PaginationHelper.CreatePagedReponse(pagedData, validFilter, totalRecords);
            return pagedReponse;
        }

        // GET: api/Projects/5
        [HttpGet("{id}")]
        public async Task<Response<Project>> GetProject(int id)
        {
            if (_context.Projects == null)
            {
                return new Response<Project> { Success = false, Message = "Empty" };
            }
            var role = await _context.Projects.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);

            if (role == null)
            {
                return new Response<Project> { Success = false, Message = "Not found" };
            }

            return new Response<Project>(role);
        }

        // PUT: api/Projects/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<Response<Project>> PutProject(int id, Project role)
        {
            if (id != role.Id)
                return new Response<Project> { Success = false, Message = "Bad request" };

            var dbProject = _context.Projects.FirstOrDefault(x => x.Id == id && !x.IsDeleted);
            if (dbProject == null)
                return new Response<Project> { Success = false, Message = "Not found" };

            dbProject.Name = role.Name;

            dbProject.UpdatedDate = DateTime.Now;
            dbProject.UpdatedById = UserId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return new Response<Project> { Success = false, Message = ex.Message };
            }

            return new Response<Project>(dbProject);
        }

        // POST: api/Projects
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<Response<Project>> PostProject(Project role)
        {
            if (_context.Projects == null)
            {
                return new Response<Project> { Success = false, Message = "Empty" };
            }

            role.CreatedDate = DateTime.Now;
            role.CreatedById = UserId;
            _context.Projects.Add(role);
            await _context.SaveChangesAsync();

            return new Response<Project>(role);
        }

        // DELETE: api/Projects/5
        [HttpDelete("{id}")]
        public async Task<Response<Project>> DeleteProject(int id)
        {
            if (_context.Projects == null)
            {
                return new Response<Project> { Success = false, Message = "Empty" };
            }
            var user = await _context.Projects.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
            if (user == null)
            {
                return new Response<Project> { Success = false, Message = "Not found" };
            }

            user.IsDeleted = true;
            user.UpdatedDate = DateTime.Now;
            user.UpdatedById = UserId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return new Response<Project> { Success = false, Message = ex.Message };
            }

            return new Response<Project>();
        }
    }
}
