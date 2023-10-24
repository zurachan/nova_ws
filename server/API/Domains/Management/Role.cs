using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Domains.Management
{
    [Table("role")]
    public class Role : BaseEntity
    {
        [Required]
        [Column("name")]
        public required string Name { get; set; }
        public virtual List<UserRole>? UserRoles { get; set; }
    }
}
