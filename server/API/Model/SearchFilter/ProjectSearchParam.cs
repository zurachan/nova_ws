namespace API.Model.SearchFilter
{
    public class ProjectSearchParam : BaseSearchParam
    {
        public ProjectSearchParam(int pageNumber, int pageSize) : base(pageNumber, pageSize)
        {
        }

        public string? Project { get; set; }
        public int Type { get; set; }
        public int Phase { get; set; }
    }
}
