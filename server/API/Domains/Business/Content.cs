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
        [Column("type")] //1: bài viết giới thiệu; 2: bài viết cập nhật tiến độ; 3: bài viết review
        public int Type { get; set; }

        [Column("pathImage")]
        public byte[]? PathImage { get; set; }
    }
}
