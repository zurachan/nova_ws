using API.Domains.Business;
using API.Domains.Management;
using Microsoft.EntityFrameworkCore;

namespace API.Domains
{
    public class AppDbContext : DbContext
    {
        public AppDbContext()
        {

        }
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        //Khởi tạo dữ liệu mẫu
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, FullName = "Admin", Address = "Hà Nội", CreatedDate = DateTime.Now, Username = "admin", Password = "123456" },
                new User { Id = 2, FullName = "Nhân viên 1", Address = "Đà Nẵng", CreatedDate = DateTime.Now, Username = "nv01", Password = "123456" },
                new User { Id = 3, FullName = "Nhân viên 2", Address = "Tp. Hồ Chí Minh", CreatedDate = DateTime.Now, Username = "nv02", Password = "123456" });

            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, Name = "ADMIN", CreatedDate = DateTime.Now },
                new Role { Id = 2, Name = "CONTENT CREATOR", CreatedDate = DateTime.Now },
                new Role { Id = 3, Name = "SALE", CreatedDate = DateTime.Now });

            modelBuilder.Entity<UserRole>().HasData(
                new UserRole { Id = 1, UserId = 1, RoleId = 1, CreatedDate = DateTime.Now },
                new UserRole { Id = 2, UserId = 2, RoleId = 2, CreatedDate = DateTime.Now },
                new UserRole { Id = 3, UserId = 3, RoleId = 3, CreatedDate = DateTime.Now });
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }

        //public DbSet<Content> Contents { get; set; }
        //public DbSet<Event> Events { get; set; }
        public DbSet<Partner> Partners { get; set; }
        public DbSet<Project> Projects { get; set; }
        //public DbSet<ProjectContent> ProjectContents { get; set; }
        //public DbSet<ProjectEvent> ProjectEvents { get; set; }
        public DbSet<ProjectPartner> ProjectPartners { get; set; }
    }
}
