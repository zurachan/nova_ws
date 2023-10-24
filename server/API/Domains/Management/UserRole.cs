using System.ComponentModel.DataAnnotations.Schema;

namespace API.Domains.Management
{
    [Table("user_role")]
    public class UserRole : BaseEntity
    {
        [ForeignKey("user")]
        public int UserId { get; set; }
        public virtual User User { get; set; }
        [ForeignKey("role")]
        public int RoleId { get; set; }
        public virtual Role Role { get; set; }
    }
}
