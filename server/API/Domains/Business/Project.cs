using API.Domains.Management;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Domains.Business
{
    [Table("project")]
    public class Project : BaseEntity
    {
        [Required]
        [Column("name")]
        public string Name { get; set; }

        [Column("content")]
        public string Content { get; set; }

        [Required]
        [Column("type")] //1: đô thị; 2: du lịch; 3: công nghiệp
        public int Type { get; set; }

        [Required]
        [Column("phase")] //1: 
        public int Phase { get; set; } = 1;

        [ForeignKey("user")]
        public int ManagerId { get; set; }
        public virtual User User { get; set; }
    }
}
