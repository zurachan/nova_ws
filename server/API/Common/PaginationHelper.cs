using API.Model.SearchFilter;

namespace API.Common
{
    public static class PaginationHelper
    {
        public static PagedResponse<List<T>> CreatePagedReponse<T>(List<T> pagedData, BaseSearchParam validFilter, int totalRecords)
        {
            var respose = new PagedResponse<List<T>>(pagedData, validFilter.PageNumber, validFilter.PageSize);
            var totalPages = ((double)totalRecords / (double)validFilter.PageSize);
            int roundedTotalPages = Convert.ToInt32(Math.Ceiling(totalPages));

            respose.NextPage = validFilter.PageNumber == roundedTotalPages ? null : validFilter.PageNumber + 1;

            respose.PreviousPage = validFilter.PageNumber == 1 ? null : validFilter.PageNumber - 1;

            respose.FirstPage = 1;

            respose.LastPage = roundedTotalPages;

            respose.TotalPages = roundedTotalPages;

            respose.TotalRecords = totalRecords;

            return respose;
        }
    }
}
