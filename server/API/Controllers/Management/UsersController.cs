using API.Common;
using API.Domains;
using API.Domains.Management;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers.Management
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ResponseData> GetUsers()
        {
            if (_context.Users == null)
            {
                return new ResponseData { Success = false, Message = "Empty" };
            }
            return new ResponseData { Success = true, Data = await _context.Users.ToListAsync() };
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ResponseData> GetUser(int id)
        {
            if (_context.Users == null)
            {
                return new ResponseData { Success = false, Message = "Empty" };
            }
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return new ResponseData { Success = false, Message = "Not found" };
            }

            return new ResponseData { Success = true, Data = user };
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<ResponseData> PutUser(int id, User user)
        {
            if (id != user.Id)
                return new ResponseData { Success = false, Message = "Bad request" };


            var dbUser = _context.Users.Find(id);
            if (dbUser == null)
                return new ResponseData { Success = false, Message = "Not found" };


            dbUser.Address = user.Address;
            dbUser.FullName = user.FullName;
            dbUser.Email = user.Email;
            dbUser.Telephone = user.Telephone;

            dbUser.Address = user.Address;
            dbUser.UpdatedDate = DateTime.Now;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return new ResponseData { Success = false, Message = ex.Message };
            }

            return new ResponseData { Success = true, Data = dbUser };
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            if (_context.Users == null)
            {
                return Problem("Entity set 'AppDbContext.Users'  is null.");
            }
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            if (_context.Users == null)
            {
                return NotFound();
            }
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return (_context.Users?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
