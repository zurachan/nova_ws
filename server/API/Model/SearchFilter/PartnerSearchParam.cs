namespace API.Model.SearchFilter
{
    public class PartnerSearchParam : BaseSearchParam
    {
        public PartnerSearchParam(int pageNumber, int pageSize) : base(pageNumber, pageSize)
        {
        }

        public string? Partner { get; set; }
    }
}
