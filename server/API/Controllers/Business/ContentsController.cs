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
    public class ContentsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        int UserId;

        public ContentsController(AppDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            var value = _httpContextAccessor.HttpContext.User.FindFirstValue("UserId");
            UserId = value != null ? int.Parse(value) : 0;
        }

        // GET: api/Contents
        [HttpPost("search")]
        public async Task<PagedResponse<List<Content>>> GetContents(ContentSearchParam param)
        {
            if (_context.Contents == null)
            {
                return new PagedResponse<List<Content>>(null) { Success = false };
            }
            var validFilter = new UserSearchParam(param.PageNumber, param.PageSize);

            var query = _context.Contents
                .Where(x => !string.IsNullOrEmpty(param.Content) ? !x.IsDeleted && x.Title.Contains(param.Content) : !x.IsDeleted)
                .OrderByDescending(x => x.Id);

            var pagedData = await query
                .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                .Take(validFilter.PageSize)
                .ToListAsync();

            var totalRecords = await query.CountAsync();
            var pagedReponse = PaginationHelper.CreatePagedReponse(pagedData, validFilter, totalRecords);
            return pagedReponse;
        }

        // GET: api/Contents/5
        [HttpGet("{id}")]
        public async Task<Response<ContentModel>> GetContent(int id)
        {
            if (_context.Contents == null)
            {
                return new Response<ContentModel> { Success = false, Message = "Empty" };
            }
            var domain = await _context.Contents.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);

            if (domain == null)
            {
                return new Response<ContentModel> { Success = false, Message = "Not found" };
            }

            var projects = await _context.ProjectContents.Where(x => x.ContentId == domain.Id && !x.IsDeleted).ToListAsync();

            var model = new ContentModel()
            {
                Id = domain.Id,
                Title = domain.Title,
                MainContent = domain.MainContent,
                Type = domain.Type,
                PathImage = domain.PathImage,
                ProjectIds = projects.Select(x => x.ProjectId).ToList()
            };

            return new Response<ContentModel>(model);
        }

        // PUT: api/Contents/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<Response<ContentModel>> PutContent(int id, ContentModel model)
        {
            if (id != model.Id)
                return new Response<ContentModel> { Success = false, Message = "Bad request" };

            var domain = _context.Contents.FirstOrDefault(x => x.Id == id && !x.IsDeleted);
            if (domain == null)
                return new Response<ContentModel> { Success = false, Message = "Not found" };

            domain.Title = model.Title;
            domain.MainContent = model.MainContent;
            domain.Type = model.Type;
            domain.PathImage = model.PathImage;
            domain.UpdatedDate = DateTime.Now;
            domain.UpdatedById = UserId;

            var domainProjectContents = _context.ProjectContents.Where(x => x.ContentId == domain.Id && !x.IsDeleted).ToList();
            if (domainProjectContents.Any())
            {
                domainProjectContents.ForEach(x =>
                {
                    x.IsDeleted = true;
                    x.UpdatedDate = DateTime.Now;
                    x.UpdatedById = UserId;
                });
            }

            model.ProjectIds.ForEach(x =>
            {
                var domainContentPartner = new ProjectContent
                {
                    Content = domain,
                    ProjectId = x,
                    CreatedById = UserId,
                    CreatedDate = DateTime.Now,
                };
                _context.ProjectContents.Add(domainContentPartner);
            });

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return new Response<ContentModel> { Success = false, Message = ex.Message };
            }

            return new Response<ContentModel>(model);
        }

        // POST: api/Contents
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<Response<ContentModel>> PostContent(ContentModel model)
        {
            if (_context.Contents == null)
            {
                return new Response<ContentModel> { Success = false, Message = "Empty" };
            }

            Content domain = new()
            {
                Title = model.Title,
                MainContent = model.MainContent,
                Type = model.Type,
                PathImage = model.PathImage,
                CreatedById = UserId,
                CreatedDate = DateTime.Now,
            };
            _context.Contents.Add(domain);

            model.ProjectIds.ForEach(x =>
            {
                var domainContentPartner = new ProjectContent
                {
                    Content = domain,
                    ProjectId = x,
                    CreatedById = UserId,
                    CreatedDate = DateTime.Now,
                };
                _context.ProjectContents.Add(domainContentPartner);
            });

            await _context.SaveChangesAsync();
            model.Id = domain.Id;

            return new Response<ContentModel>(model);
        }

        // DELETE: api/Contents/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<Response<Content>> DeleteContent(int id)
        {
            if (_context.Contents == null)
            {
                return new Response<Content> { Success = false, Message = "Empty" };
            }
            var domain = await _context.Contents.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
            if (domain == null)
            {
                return new Response<Content> { Success = false, Message = "Not found" };
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
                return new Response<Content> { Success = false, Message = ex.Message };
            }

            return new Response<Content> { Success = true };
        }
    }
}
