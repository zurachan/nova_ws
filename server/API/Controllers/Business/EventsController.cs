using API.Common;
using API.Domains;
using API.Domains.Business;
using API.Model.Business;
using API.Model.SearchFilter;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers.Business
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        int UserId;

        public EventsController(AppDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            UserId = int.Parse(_httpContextAccessor.HttpContext?.User.FindFirstValue("UserId"));
        }

        // GET: api/Events
        [HttpPost("search")]
        public async Task<PagedResponse<List<Event>>> GetEvents(EventSearchParam param)
        {
            if (_context.Events == null)
            {
                return new PagedResponse<List<Event>>(null) { Success = false };
            }
            var validFilter = new UserSearchParam(param.PageNumber, param.PageSize);

            var query = _context.Events
                .Where(x => !string.IsNullOrEmpty(param.Event) ? !x.IsDeleted && x.Name.Contains(param.Event) : !x.IsDeleted)
                .OrderByDescending(x => x.Id);

            var pagedData = await query
                .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                .Take(validFilter.PageSize)
                .ToListAsync();

            var totalRecords = await query.CountAsync();
            var pagedReponse = PaginationHelper.CreatePagedReponse(pagedData, validFilter, totalRecords);
            return pagedReponse;
        }

        // GET: api/Events/5
        [HttpGet("{id}")]
        public async Task<Response<EventModel>> GetEvent(int id)
        {
            if (_context.Events == null)
            {
                return new Response<EventModel> { Success = false, Message = "Empty" };
            }
            var domain = await _context.Events.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);

            if (domain == null)
            {
                return new Response<EventModel> { Success = false, Message = "Not found" };
            }

            var projects = await _context.ProjectEvents.Where(x => x.EventId == domain.Id && !x.IsDeleted).ToListAsync();

            var model = new EventModel()
            {
                Id = domain.Id,
                Name = domain.Name,
                Description = domain.Description,
                Start = domain.Start,
                End = domain.End,
                Status = domain.Status,
                Type = domain.Type,
                ProjectIds = projects.Select(x => x.ProjectId).ToList()
            };

            return new Response<EventModel>(model);
        }

        // PUT: api/Events/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<Response<EventModel>> PutEvent(int id, EventModel model)
        {
            if (id != model.Id)
                return new Response<EventModel> { Success = false, Message = "Bad request" };

            var domain = _context.Events.FirstOrDefault(x => x.Id == id && !x.IsDeleted);
            if (domain == null)
                return new Response<EventModel> { Success = false, Message = "Not found" };

            domain.Name = model.Name;
            domain.Start = model.Start;
            domain.End = model.End;
            domain.Status = model.Status;
            domain.Type = model.Type;

            domain.UpdatedDate = DateTime.Now;
            domain.UpdatedById = UserId;

            var domainProjectEvents = _context.ProjectEvents.Where(x => x.EventId == domain.Id && !x.IsDeleted).ToList();
            if (domainProjectEvents.Any())
            {
                domainProjectEvents.ForEach(x =>
                {
                    x.IsDeleted = true;
                    x.UpdatedDate = DateTime.Now;
                    x.UpdatedById = UserId;
                });
            }

            model.ProjectIds.ForEach(x =>
            {
                var domainEventPartner = new ProjectEvent
                {
                    Event = domain,
                    ProjectId = x,
                    CreatedById = UserId,
                    CreatedDate = DateTime.Now,
                };
                _context.ProjectEvents.Add(domainEventPartner);
            });

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return new Response<EventModel> { Success = false, Message = ex.Message };
            }

            return new Response<EventModel>(model);
        }

        // POST: api/Events
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<Response<EventModel>> PostEvent(EventModel model)
        {
            if (_context.Events == null)
            {
                return new Response<EventModel> { Success = false, Message = "Empty" };
            }

            Event domain = new()
            {
                Name = model.Name,
                Description = model.Description,
                Start = model.Start,
                End = model.End,
                Status = model.Status,
                Type = model.Type,
                CreatedById = UserId,
                CreatedDate = DateTime.Now,
            };
            _context.Events.Add(domain);

            model.ProjectIds.ForEach(x =>
            {
                var domainEventPartner = new ProjectEvent
                {
                    Event = domain,
                    ProjectId = x,
                    CreatedById = UserId,
                    CreatedDate = DateTime.Now,
                };
                _context.ProjectEvents.Add(domainEventPartner);
            });

            await _context.SaveChangesAsync();
            model.Id = domain.Id;

            return new Response<EventModel>(model);
        }

        // DELETE: api/Events/5
        [HttpDelete("{id}")]
        public async Task<Response<Event>> DeleteEvent(int id)
        {
            if (_context.Events == null)
            {
                return new Response<Event> { Success = false, Message = "Empty" };
            }
            var domain = await _context.Events.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
            if (domain == null)
            {
                return new Response<Event> { Success = false, Message = "Not found" };
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
                return new Response<Event> { Success = false, Message = ex.Message };
            }

            return new Response<Event> { Success = true };
        }
    }
}
