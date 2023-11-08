namespace API.Common
{
    public class Response<T>
    {
        public Response()
        {
        }
        public Response(T data)
        {
            Success = true;
            Message = string.Empty;
            Data = data;
        }
        public T Data { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; }
    }
}
