namespace API.Model.Business
{
    public class ProjectModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Content { get; set; }
        public int Type { get; set; }
        public int Phase { get; set; }
        public int UserId { get; set; }
        public List<int> PartnerIds { get; set; }
    }
}
