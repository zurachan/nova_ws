using API.Common;
using API.Domains;
using API.Domains.Business;
using API.Model.Business;
using API.Model.SearchFilter;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers.Business
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        int UserId;
        private IMailService _mailService;

        public CustomersController(AppDbContext context, IHttpContextAccessor httpContextAccessor, IMailService mailService)
        {
            _context = context;
            _mailService = mailService;
            _httpContextAccessor = httpContextAccessor;
            var value = _httpContextAccessor.HttpContext.User.FindFirstValue("UserId");
            UserId = value != null ? int.Parse(value) : 0;
        }

        // GET: api/Customers
        [HttpPost("search")]
        public async Task<PagedResponse<List<Customer>>> GetCustomers(CustomerSearchParam param)
        {
            if (_context.Customers == null)
            {
                return new PagedResponse<List<Customer>>(null) { Success = false };
            }
            var validFilter = new UserSearchParam(param.PageNumber, param.PageSize);

            var query = _context.Customers
                .Where(x => !string.IsNullOrEmpty(param.Customer) ? !x.IsDeleted && (x.FullName.Contains(param.Customer) || x.Telephone.Contains(param.Customer) || x.Email.Contains(param.Customer)) : !x.IsDeleted)
                .OrderByDescending(x => x.Id);

            var pagedData = await query
                .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                .Take(validFilter.PageSize)
                .ToListAsync();

            var totalRecords = await query.CountAsync();
            var pagedReponse = PaginationHelper.CreatePagedReponse(pagedData, validFilter, totalRecords);
            return pagedReponse;
        }

        // GET: api/Customers/5
        [HttpGet("{id}")]
        public async Task<Response<CustomerModel>> GetCustomer(int id)
        {
            if (_context.Customers == null)
            {
                return new Response<CustomerModel> { Success = false, Message = "Empty" };
            }
            var domain = await _context.Customers.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);

            if (domain == null)
            {
                return new Response<CustomerModel> { Success = false, Message = "Not found" };
            }

            var model = new CustomerModel()
            {
                Id = domain.Id,
                FullName = domain.FullName,
                Telephone = domain.Telephone,
                Email = domain.Email,
            };

            return new Response<CustomerModel>(model);
        }

        // PUT: api/Customers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<Response<CustomerModel>> PutCustomer(int id, CustomerModel model)
        {
            if (id != model.Id)
                return new Response<CustomerModel> { Success = false, Message = "Bad request" };

            var domain = _context.Customers.FirstOrDefault(x => x.Id == id && !x.IsDeleted);
            if (domain == null)
                return new Response<CustomerModel> { Success = false, Message = "Not found" };

            domain.FullName = model.FullName;
            domain.Telephone = model.Telephone;
            domain.Email = model.Email;
            domain.Address = model.Address;

            domain.UpdatedDate = DateTime.Now;
            domain.UpdatedById = UserId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return new Response<CustomerModel> { Success = false, Message = ex.Message };
            }

            return new Response<CustomerModel>(model);
        }

        // POST: api/Customers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<Response<CustomerModel>> PostCustomer(CustomerModel model)
        {
            if (_context.Customers == null)
            {
                return new Response<CustomerModel> { Success = false, Message = "Empty" };
            }

            var domain = await _context.Customers.FirstOrDefaultAsync(x => !x.IsDeleted && x.Email == model.Email && x.Telephone == model.Telephone);

            if (domain == null)
            {
                domain = new Customer()
                {
                    FullName = model.FullName,
                    Telephone = model.Telephone,
                    Email = model.Email,
                    Address = model.Address,
                    SubcribeType = model.ProjectId.HasValue ? (int)SubcribeType.Update : (int)SubcribeType.Create,

                    CreatedById = UserId,
                    CreatedDate = DateTime.Now,
                };
                _context.Customers.Add(domain);

                if (model.ProjectId.HasValue)
                {
                    var existedProject = await _context.Projects.FirstOrDefaultAsync(x => !x.IsDeleted && x.Id == model.ProjectId);
                    if (existedProject != null)
                    {
                        ProjectCustomer projectCustomer = new()
                        {
                            Project = existedProject,
                            Customer = domain,
                            CreatedById = UserId,
                            CreatedDate = DateTime.Now,
                        };
                        _context.ProjectCustomers.Add(projectCustomer);
                    }
                }
            }
            else
            {
                if (model.ProjectId.HasValue)
                {
                    if (domain.SubcribeType == (int)SubcribeType.Create)
                        domain.SubcribeType = (int)SubcribeType.All;

                    var existedProject = await _context.Projects.FirstOrDefaultAsync(x => !x.IsDeleted && x.Id == model.ProjectId);
                    if (existedProject != null)
                    {
                        ProjectCustomer projectCustomer = new()
                        {
                            Project = existedProject,
                            Customer = domain,
                            CreatedById = UserId,
                            CreatedDate = DateTime.Now,
                        };
                        _context.ProjectCustomers.Add(projectCustomer);
                    }
                }
                else
                {
                    if (domain.SubcribeType == (int)SubcribeType.Update)
                        domain.SubcribeType = (int)SubcribeType.All;
                }
            }

            await _context.SaveChangesAsync();

            //_mailService.SendMailConfirmSubcribe(null);

            return new Response<CustomerModel>(model);
        }

        // DELETE: api/Customers/5
        [HttpDelete("{id}")]
        public async Task<Response<Customer>> DeleteCustomer(int id)
        {
            if (_context.Customers == null)
            {
                return new Response<Customer> { Success = false, Message = "Empty" };
            }
            var domain = await _context.Customers.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
            if (domain == null)
            {
                return new Response<Customer> { Success = false, Message = "Not found" };
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
                return new Response<Customer> { Success = false, Message = ex.Message };
            }

            return new Response<Customer> { Success = true };
        }
    }
}
