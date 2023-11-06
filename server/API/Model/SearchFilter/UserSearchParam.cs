namespace API.Model.SearchFilter
{
    public class UserSearchParam : BaseSearchParam
    {
        public UserSearchParam(int pageNumber, int pageSize) : base(pageNumber, pageSize)
        {
        }

        public string? User { get; set; }
    }
}
