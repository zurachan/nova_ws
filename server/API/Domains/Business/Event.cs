using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Domains.Business
{
    [Table("event")]
    public class Event : BaseEntity
    {
        [Required]
        [Column("name")]
        public string Name { get; set; }
        [Column("description")]
        public string Description { get; set; }
        [Required]
        [Column("start")]
        public DateTime Start { get; set; }
        [Required]
        [Column("end")]
        public DateTime End { get; set; }
        [Required]
        [Column("status")] // 1: lên kế hoạch; 2: sắp diễn ra; 3: đang diễn ra; 4: đã kết thúc
        public int Status { get; set; }
        [Required]
        [Column("type")] // 1: Định kỳ; 2: hàng năm; 3: một lần duy nhất
        public int Type { get; set; }
    }
}
