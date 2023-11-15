using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Domains.Management
{
    [Table("user")]
    public class User : BaseEntity
    {
        [Required]
        [Column("fullname")]
        public string FullName { get; set; }
        [Column("address")]
        public string? Address { get; set; }
        [Column("email")]
        public string? Email { get; set; }
        [Column("telephone")]
        public string? Telephone { get; set; }
        [Required]
        [Column("username")]
        public string Username { get; set; }

        [Column("password")]
        public string Password { get; set; } = "123456";

        [Column("pathImage")]
        public string? PathImage { get; set; }

        public virtual List<UserRole>? UserRoles { get; set; }
    }
}
