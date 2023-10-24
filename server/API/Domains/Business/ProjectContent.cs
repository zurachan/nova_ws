﻿using System.ComponentModel.DataAnnotations.Schema;

namespace API.Domains.Business
{
    [Table("project_content")]
    public class ProjectContent : BaseEntity
    {
        [ForeignKey("project")]
        public int ProjectId { get; set; }
        public virtual required Project Project { get; set; }
        [ForeignKey("content")]
        public int ContentId { get; set; }
        public virtual required Content Content { get; set; }
    }
}
