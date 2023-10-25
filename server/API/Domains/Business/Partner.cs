using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Domains.Business
{
    [Table("partner")]
    public class Partner : BaseEntity
    {
        [Required]
        [Column("name")]
        public string Name { get; set; }

        [Column("address")]
        public string Address { get; set; }

        [Required]
        [Column("email")]
        public string Email { get; set; }

        [Required]
        [Column("telephone")]
        public string Telephone { get; set; }
    }
}
