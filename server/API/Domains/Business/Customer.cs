using System.ComponentModel.DataAnnotations.Schema;

namespace API.Domains.Business
{
    [Table("customer")]
    public class Customer : BaseEntity
    {
        [Column("fullname")]
        public string FullName { get; set; }

        [Column("telephone")]
        public string Telephone { get; set; }

        [Column("email")]
        public string Email { get; set; }

        [Column("address")]
        public string? Address { get; set; }

        [Column("pathImage")]
        public string? PathImage { get; set; }

        [Column("subcribeType")]
        public int SubcribeType { get; set; }
    }
}
