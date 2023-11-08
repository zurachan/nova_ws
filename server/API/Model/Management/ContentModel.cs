namespace API.Model.Management
{
    public class ContentModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string MainContent { get; set; }
        public int Type { get; set; }
        public List<int> ProjectIds { get; set; }
    }
}
