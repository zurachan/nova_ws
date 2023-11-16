namespace API.Model.Management
{
    public class FileRequest
    {
        public IFormFile? FormFile { get; set; }
    }

    public class FileResponse
    {
        public byte[]? FileData { get; set; }
    }
}
