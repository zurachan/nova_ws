namespace API.Model.SearchFilter
{
    public class EventSearchParam : BaseSearchParam
    {
        public EventSearchParam(int pageNumber, int pageSize) : base(pageNumber, pageSize)
        {
        }

        public string? Event { get; set; }
    }
}
