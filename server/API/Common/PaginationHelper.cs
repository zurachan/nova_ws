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

            respose.Paging.NextPage = validFilter.PageNumber >= roundedTotalPages ? null : validFilter.PageNumber + 1;

            respose.Paging.PreviousPage = validFilter.PageNumber == 1 ? null : validFilter.PageNumber - 1;

            respose.Paging.FirstPage = 1;

            respose.Paging.LastPage = roundedTotalPages;

            respose.Paging.TotalPages = roundedTotalPages;

            respose.Paging.TotalRecords = totalRecords;

            respose.Paging.CurrentRecords = pagedData.Count;

            return respose;
        }
    }
}
