namespace API.Model.SearchFilter
{
    public class CustomerSearchParam : BaseSearchParam
    {
        public CustomerSearchParam(int pageNumber, int pageSize) : base(pageNumber, pageSize)
        {
        }
        public string? Customer { get; set; }
    }
}
