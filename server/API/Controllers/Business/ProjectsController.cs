using API.Common;
using API.Domains;
using API.Domains.Business;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers.Business
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProjectsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Projects
        [HttpGet]
        public async Task<Response<Project>> GetProjects()
        {
            if (_context.Projects == null)
            {
                return new Response<Project> { Success = false, Message = "Empty" };
            }
            //return new Response<Project> { Success = true, Data = await _context.Projects.ToListAsync() };
            return null;
        }

        // GET: api/Projects/5
        [HttpGet("{id}")]
        public async Task<Response<Project>> GetProject(int id)
        {
            if (_context.Projects == null)
            {
                return new Response<Project> { Success = false, Message = "Empty" };
            }
            var project = await _context.Projects.FindAsync(id);

            if (project == null)
            {
                return new Response<Project> { Success = false, Message = "Not found" };
            }

            return new Response<Project> { Success = true, Data = project };
        }

        // PUT: api/Projects/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<Response<Project>> PutProject(int id, Project project)
        {
            if (id != project.Id)
            {
                return new Response<Project> { Success = false, Message = "Bad request" };
            }

            var dbProject = await _context.Projects.FindAsync(id);
            if (dbProject == null)
                return new Response<Project> { Success = false, Message = "Not found" };

            dbProject.Name = project.Name;
            dbProject.Content = project.Content;
            dbProject.Type = project.Type;
            dbProject.Phase = project.Phase;
            dbProject.ManagerId = project.ManagerId;

            dbProject.UpdatedDate = DateTime.Now;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return new Response<Project> { Success = false, Message = ex.Message };
            }

            return new Response<Project> { Success = true, Data = dbProject };
        }

        // POST: api/Projects
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<Response<Project>> PostProject(Project project)
        {
            if (_context.Projects == null)
            {
                return new Response<Project> { Success = false, Message = "Empty" };
            }
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return new Response<Project> { Success = true, Data = project };
        }

        // DELETE: api/Projects/5
        [HttpDelete("{id}")]
        public async Task<Response<Project>> DeleteProject(int id)
        {
            if (_context.Projects == null)
            {
                return new Response<Project> { Success = false, Message = "Empty" };
            }
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return new Response<Project> { Success = false, Message = "Not found" };
            }

            project.IsDeleted = false;
            project.UpdatedDate = DateTime.Now;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return new Response<Project> { Success = false, Message = ex.Message };
            }

            return new Response<Project> { Success = true };
        }
    }
}
