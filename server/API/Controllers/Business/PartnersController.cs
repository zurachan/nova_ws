using API.Common;
using API.Domains;
using API.Domains.Business;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers.Business
{
    [Route("api/[controller]")]
    [ApiController]
    public class PartnersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PartnersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Partners
        [HttpGet]
        public async Task<ResponseData> GetPartners()
        {
            if (_context.Partners == null)
            {
                return new ResponseData { Success = false, Message = "Empty" };
            }

            return new ResponseData { Success = true, Data = await _context.Partners.ToListAsync() };
        }

        // GET: api/Partners/5
        [HttpGet("{id}")]
        public async Task<ResponseData> GetPartner(int id)
        {
            if (_context.Partners == null)
            {
                return new ResponseData { Success = false, Message = "Empty" };
            }
            var partner = await _context.Partners.FindAsync(id);

            if (partner == null)
            {
                return new ResponseData { Success = false, Message = "Not found" };
            }

            return new ResponseData { Success = true, Data = partner };
        }

        // PUT: api/Partners/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<ResponseData> PutPartner(int id, Partner partner)
        {
            if (id != partner.Id)
            {
                return new ResponseData { Success = false, Message = "Bad request" };
            }

            var dbPartner = await _context.Partners.FindAsync(id);
            if (dbPartner == null)
                return new ResponseData { Success = false, Message = "Not found" };

            dbPartner.Name = partner.Name;
            dbPartner.Address = partner.Address;
            dbPartner.Email = partner.Email;
            dbPartner.Telephone = partner.Telephone;
            dbPartner.UpdatedDate = DateTime.Now;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return new ResponseData { Success = false, Message = ex.Message };
            }

            return new ResponseData { Success = true, Data = dbPartner };
        }

        // POST: api/Partners
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ResponseData> PostPartner(Partner partner)
        {
            if (_context.Partners == null)
            {
                return new ResponseData { Success = false, Message = "Empty" };
            }

            _context.Partners.Add(partner);
            await _context.SaveChangesAsync();

            return new ResponseData { Success = true, Data = partner };
        }

        // DELETE: api/Partners/5
        [HttpDelete("{id}")]
        public async Task<ResponseData> DeletePartner(int id)
        {
            if (_context.Partners == null)
            {
                return new ResponseData { Success = false, Message = "Empty" };
            }
            var partner = await _context.Partners.FindAsync(id);
            if (partner == null)
            {
                return new ResponseData { Success = false, Message = "Not found" };
            }

            partner.IsDeleted = true;
            partner.UpdatedDate = DateTime.Now;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return new ResponseData { Success = false, Message = ex.Message };
            }

            return new ResponseData { Success = true };
        }
    }
}
