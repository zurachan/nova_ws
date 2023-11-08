namespace API.Model.SearchFilter
{
    public class ContentSearchParam : BaseSearchParam
    {
        public ContentSearchParam(int pageNumber, int pageSize) : base(pageNumber, pageSize)
        {
        }
        public string? Content { get; set; }

    }
}
