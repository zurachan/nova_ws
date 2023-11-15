using API.Common;
using API.Domains;
using API.Domains.Business;
using API.Model.Business;
using API.Model.SearchFilter;
using Microsoft.AspNetCore.Authorization;
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
            var value = _httpContextAccessor.HttpContext.User.FindFirstValue("UserId");
            UserId = value != null ? int.Parse(value) : 0;
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

            var query = _context.Projects.Where(x => !x.IsDeleted);

            if (!string.IsNullOrEmpty(param.Project))
            {
                query = query.Where(x => x.Name.Contains(param.Project));
            }

            if (param.Type != 0)
            {
                query = query.Where(x => x.Type == param.Type);
            }

            if (param.Phase != 0)
            {
                query = query.Where(x => x.Phase == param.Phase);
            }

            query.OrderByDescending(x => x.Id);

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
        public async Task<Response<ProjectModel>> GetProject(int id)
        {
            if (_context.Projects == null)
            {
                return new Response<ProjectModel> { Success = false, Message = "Empty" };
            }
            var domain = await _context.Projects.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);

            if (domain == null)
            {
                return new Response<ProjectModel> { Success = false, Message = "Not found" };
            }

            var partners = await _context.ProjectPartners.Where(x => x.ProjectId == domain.Id && !x.IsDeleted).ToListAsync();

            var model = new ProjectModel()
            {
                Id = domain.Id,
                Name = domain.Name,
                Content = domain.Content,
                Type = domain.Type,
                Phase = domain.Phase,
                UserId = domain.UserId,
                PathImage = domain.PathImage,
                PartnerIds = partners.Select(x => x.PartnerId).ToList()
            };

            return new Response<ProjectModel>(model);
        }

        // PUT: api/Projects/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<Response<ProjectModel>> PutProject(int id, ProjectModel model)
        {
            if (id != model.Id)
                return new Response<ProjectModel> { Success = false, Message = "Bad request" };

            var domain = _context.Projects.FirstOrDefault(x => x.Id == id && !x.IsDeleted);
            if (domain == null)
                return new Response<ProjectModel> { Success = false, Message = "Not found" };

            domain.Name = model.Name;
            domain.Content = model.Content;
            domain.Type = model.Type;
            domain.Phase = model.Phase;
            domain.PathImage = model.PathImage;
            domain.UserId = model.UserId;
            domain.UpdatedDate = DateTime.Now;
            domain.UpdatedById = UserId;

            var domainProjectPartners = _context.ProjectPartners.Where(x => x.ProjectId == domain.Id && !x.IsDeleted).ToList();
            if (domainProjectPartners.Any())
            {
                domainProjectPartners.ForEach(x =>
                {
                    x.IsDeleted = true;
                    x.UpdatedDate = DateTime.Now;
                    x.UpdatedById = UserId;
                });
            }

            model.PartnerIds.ForEach(x =>
            {
                var domainProjectPartner = new ProjectPartner
                {
                    Project = domain,
                    PartnerId = x,
                    CreatedById = UserId,
                    CreatedDate = DateTime.Now,
                };
                _context.ProjectPartners.Add(domainProjectPartner);
            });

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return new Response<ProjectModel> { Success = false, Message = ex.Message };
            }

            return new Response<ProjectModel>(model);
        }

        // POST: api/Projects
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<Response<ProjectModel>> PostProject(ProjectModel model)
        {
            if (_context.Projects == null)
            {
                return new Response<ProjectModel> { Success = false, Message = "Empty" };
            }

            var domain = new Project
            {
                Name = model.Name,
                Content = model.Content,
                Type = model.Type,
                Phase = model.Phase,
                UserId = model.UserId,
                PathImage = model.PathImage,
                CreatedById = UserId,
                CreatedDate = DateTime.Now,
            };
            _context.Projects.Add(domain);

            model.PartnerIds.ForEach(x =>
            {
                var domainProjectPartner = new ProjectPartner
                {
                    Project = domain,
                    PartnerId = x,
                    CreatedById = UserId,
                    CreatedDate = DateTime.Now,
                };
                _context.ProjectPartners.Add(domainProjectPartner);
            });

            await _context.SaveChangesAsync();
            model.Id = domain.Id;

            return new Response<ProjectModel>(model);
        }

        // DELETE: api/Projects/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<Response<Project>> DeleteProject(int id)
        {
            if (_context.Projects == null)
            {
                return new Response<Project> { Success = false, Message = "Empty" };
            }
            var domain = await _context.Projects.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
            if (domain == null)
            {
                return new Response<Project> { Success = false, Message = "Not found" };
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
                return new Response<Project> { Success = false, Message = ex.Message };
            }

            return new Response<Project> { Success = true };
        }
    }
}
