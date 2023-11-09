using System.ComponentModel.DataAnnotations.Schema;

namespace API.Domains.Business
{
    [Table("project_customer")]
    public class ProjectCustomer : BaseEntity
    {
        [ForeignKey("project")]
        public int ProjectId { get; set; }
        public virtual Project Project { get; set; }
        [ForeignKey("customer")]
        public int CustomerId { get; set; }
        public virtual Customer Customer { get; set; }
    }
}
