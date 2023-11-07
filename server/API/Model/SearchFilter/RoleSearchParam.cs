namespace API.Model.SearchFilter
{
    public class RoleSearchParam : BaseSearchParam
    {
        public RoleSearchParam(int pageNumber, int pageSize) : base(pageNumber, pageSize)
        {
        }
        public string? Role { get; set; }
    }
}
