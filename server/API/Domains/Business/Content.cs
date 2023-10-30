using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Domains.Business
{
    [Table("content")]
    public class Content : BaseEntity
    {
        [Required]
        [Column("title")]
        public string Title { get; set; }
        [Required]
        [Column("maincontent")]
        public string MainContent { get; set; }
        [Required]
        [Column("type")] //1: đô thị; 2: du lịch; 3: công nghiệp
        public int Type { get; set; }
    }
}
