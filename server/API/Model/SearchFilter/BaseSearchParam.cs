﻿namespace API.Model.SearchFilter
{
    public class BaseSearchParam
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public BaseSearchParam()
        {
            PageNumber = 1;
            PageSize = 10;
        }
        public BaseSearchParam(int pageNumber, int pageSize)
        {
            PageNumber = pageNumber < 1 ? 1 : pageNumber;
            PageSize = pageSize > 10 ? 10 : pageSize;
        }
    }
}
