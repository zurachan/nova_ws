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

    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        int UserId;

        public UsersController(AppDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            var value = _httpContextAccessor.HttpContext.User.FindFirstValue("UserId");
            UserId = value != null ? int.Parse(value) : 0;
        }

        // GET: api/Users
        [HttpPost("search")]
        public async Task<PagedResponse<List<User>>> GetUsers(UserSearchParam param)
        {
            if (_context.Users == null)
            {
                return new PagedResponse<List<User>>(null) { Success = false };
            }
            var validFilter = new UserSearchParam(param.PageNumber, param.PageSize);

            var query = _context.Users
                .Where(x => !string.IsNullOrEmpty(param.User) ? !x.IsDeleted && (x.FullName.Contains(param.User) || x.Username.Contains(param.User)) : !x.IsDeleted)
                .OrderByDescending(x => x.Id);

            var pagedData = await query
                .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                .Take(validFilter.PageSize)
                .ToListAsync();

            var totalRecords = await query.CountAsync();
            var pagedReponse = PaginationHelper.CreatePagedReponse(pagedData, validFilter, totalRecords);
            return pagedReponse;
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<Response<User>> GetUser(int id)
        {
            if (_context.Users == null)
            {
                return new Response<User> { Success = false, Message = "Empty" };
            }
            var domain = await _context.Users.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);

            if (domain == null)
            {
                return new Response<User> { Success = false, Message = "Not found" };
            }

            return new Response<User>(domain);
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<Response<User>> PutUser(int id, User model)
        {
            if (id != model.Id)
                return new Response<User> { Success = false, Message = "Bad request" };


            var domain = _context.Users.FirstOrDefault(x => x.Id == id && !x.IsDeleted);
            if (domain == null)
                return new Response<User> { Success = false, Message = "Not found" };


            domain.Address = model.Address;
            domain.FullName = model.FullName;
            domain.Email = model.Email;
            domain.Telephone = model.Telephone;
            domain.Address = model.Address;
            domain.Biography = model.Biography;

            domain.UpdatedDate = DateTime.Now;
            domain.UpdatedById = UserId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return new Response<User> { Success = false, Message = ex.Message };
            }

            return new Response<User>(domain);
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<Response<User>> PostUser(User model)
        {
            if (_context.Users == null)
            {
                return new Response<User> { Success = false, Message = "Empty" };
            }

            model.CreatedDate = DateTime.Now;
            model.CreatedById = UserId;
            _context.Users.Add(model);
            await _context.SaveChangesAsync();

            return new Response<User>(model);
        }

        [HttpDelete("{id}")]
        public async Task<Response<User>> DeleteUser(int id)
        {
            if (_context.Users == null)
            {
                return new Response<User> { Success = false, Message = "Empty" };
            }
            var domain = await _context.Users.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
            if (domain == null)
            {
                return new Response<User> { Success = false, Message = "Not found" };
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
                return new Response<User> { Success = false, Message = ex.Message };
            }

            return new Response<User>();
        }
    }
}
