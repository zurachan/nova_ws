namespace API.Model.Management
{
    public class MultiFileUpload
    {
        public int ItemId { get; set; }
        public int ItemType { get; set; }
        public List<IFormFile> FileDetails { get; set; }
    }
}
