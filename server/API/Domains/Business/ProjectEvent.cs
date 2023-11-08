using System.ComponentModel.DataAnnotations.Schema;

namespace API.Domains.Business
{
    [Table("project_event")]
    public class ProjectEvent : BaseEntity
    {
        [ForeignKey("project")]
        public int ProjectId { get; set; }
        public virtual Project Project { get; set; }
        [ForeignKey("event")]
        public int EventId { get; set; }
        public virtual Event Event { get; set; }
    }
}
