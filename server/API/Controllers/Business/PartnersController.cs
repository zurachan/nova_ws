using API.Common;
using API.Domains;
using API.Domains.Business;
using API.Model.SearchFilter;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers.Business
{
    [Route("api/[controller]")]
    [ApiController]
    public class PartnersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        int UserId;

        public PartnersController(AppDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            UserId = int.Parse(_httpContextAccessor.HttpContext?.User.FindFirstValue("UserId"));
        }

        // GET: api/Partners
        [HttpPost("search")]
        public async Task<PagedResponse<List<Partner>>> GetPartners(PartnerSearchParam param)
        {
            if (_context.Partners == null)
            {
                return new PagedResponse<List<Partner>>(null) { Success = false };
            }
            var validFilter = new UserSearchParam(param.PageNumber, param.PageSize);

            var query = _context.Partners
                .Where(x => !string.IsNullOrEmpty(param.Partner) ? !x.IsDeleted && x.Name.Contains(param.Partner) : !x.IsDeleted)
                .OrderByDescending(x => x.Id);

            var pagedData = await query
                .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                .Take(validFilter.PageSize)
                .ToListAsync();

            var totalRecords = await query.CountAsync();
            var pagedReponse = PaginationHelper.CreatePagedReponse(pagedData, validFilter, totalRecords);
            return pagedReponse;
        }

        // GET: api/Partners/5
        [HttpGet("{id}")]
        public async Task<Response<Partner>> GetPartner(int id)
        {
            if (_context.Partners == null)
            {
                return new Response<Partner> { Success = false, Message = "Empty" };
            }
            var domain = await _context.Partners.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);

            if (domain == null)
            {
                return new Response<Partner> { Success = false, Message = "Not found" };
            }

            return new Response<Partner>(domain);
        }

        // PUT: api/Partners/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<Response<Partner>> PutPartner(int id, Partner model)
        {
            if (id != model.Id)
                return new Response<Partner> { Success = false, Message = "Bad request" };

            var domain = _context.Partners.FirstOrDefault(x => x.Id == id && !x.IsDeleted);
            if (domain == null)
                return new Response<Partner> { Success = false, Message = "Not found" };

            domain.Name = model.Name;
            domain.Address = model.Address;
            domain.Telephone = model.Telephone;
            domain.Email = model.Email;

            domain.UpdatedDate = DateTime.Now;
            domain.UpdatedById = UserId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return new Response<Partner> { Success = false, Message = ex.Message };
            }

            return new Response<Partner>(domain);
        }

        // POST: api/Partners
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<Response<Partner>> PostPartner(Partner model)
        {
            if (_context.Partners == null)
            {
                return new Response<Partner> { Success = false, Message = "Empty" };
            }

            model.CreatedDate = DateTime.Now;
            model.CreatedById = UserId;
            _context.Partners.Add(model);
            await _context.SaveChangesAsync();

            return new Response<Partner>(model);
        }

        // DELETE: api/Partners/5
        [HttpDelete("{id}")]
        public async Task<Response<Partner>> DeletePartner(int id)
        {
            if (_context.Partners == null)
            {
                return new Response<Partner> { Success = false, Message = "Empty" };
            }
            var domain = await _context.Partners.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
            if (domain == null)
            {
                return new Response<Partner> { Success = false, Message = "Not found" };
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
                return new Response<Partner> { Success = false, Message = ex.Message };
            }

            return new Response<Partner> { Success = true };
        }
    }
}
