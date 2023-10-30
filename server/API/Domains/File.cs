using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Domains
{
    [Table("file_upload")]
    public class File : BaseEntity
    {
        [Required]
        [Column("itemid")]
        public int ItemId { get; set; }
        [Required]
        [Column("itemtype")]
        public int ItemType { get; set; }
        [Required]
        [Column("filename")]
        public string FileName { get; set; }
        [Required]
        [Column("filepath")]
        public string FilePath { get; set; }
        [Required]
        [Column("filetype")]
        public string FileType { get; set; }
    }
}
