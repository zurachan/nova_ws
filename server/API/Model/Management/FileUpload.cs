﻿using API.Common;

namespace API.Model.Management
{
    public class FileUpload
    {
        public int ItemId { get; set; }
        public int ItemType { get; set; }
        public IFormFile FileDetails { get; set; }
    }
}