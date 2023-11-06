namespace API.Common
{
    public class PagedResponse<T> : Response<T>
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int FirstPage { get; set; }
        public int LastPage { get; set; }
        public int TotalPages { get; set; }
        public int TotalRecords { get; set; }
        public int? NextPage { get; set; }
        public int? PreviousPage { get; set; }

        public PagedResponse(T data, int pageNumber = 1, int pageSize = 10)
        {
            Data = data;
            PageNumber = pageNumber;
            PageSize = pageSize;
            Message = null;
            Success = true;
        }
    }
}
