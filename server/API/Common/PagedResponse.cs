namespace API.Common
{
    public class PagedResponse<T> : Response<T>
    {
        public Paging Paging { get; set; } = new Paging();

        public PagedResponse(T data, int pageNumber = 1, int pageSize = 10)
        {
            Data = data;
            Paging.PageNumber = pageNumber;
            Paging.PageSize = pageSize;
            Message = null;
            Success = true;
        }
    }
}
