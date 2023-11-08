using System.ComponentModel.DataAnnotations.Schema;

namespace API.Domains.Business
{
    [Table("project_partner")]
    public class ProjectPartner : BaseEntity
    {
        [ForeignKey("project")]
        public int ProjectId { get; set; }
        public virtual Project Project { get; set; }
        [ForeignKey("partner")]
        public int PartnerId { get; set; }
        public virtual Partner Partner { get; set; }
    }
}
