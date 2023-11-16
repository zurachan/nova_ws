namespace API.Model.Business
{
    public class ContentModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string MainContent { get; set; }
        public int Type { get; set; }
        public byte[]? PathImage { get; set; }
        public int? CreatedById { get; set; }
        public DateTime? CreatedDate { get; set; }
        public List<int> ProjectIds { get; set; }
    }
}
