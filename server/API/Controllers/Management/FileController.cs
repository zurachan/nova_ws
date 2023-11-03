using API.Common;
using API.Model.Management;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Management
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IFileService _uploadService;

        public FileController(IFileService uploadService)
        {
            _uploadService = uploadService;
        }

        /// <summary>
        /// Single File Upload
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        [HttpPost("PostSingleFile")]
        public async Task<ResponseData> PostSingleFile([FromForm] FileUpload fileDetails)
        {
            if (fileDetails == null)
            {
                return new ResponseData { Success = false, Message = "Empty" };
            }
            try
            {
                var result = await _uploadService.PostFileAsync(fileDetails);
                return new ResponseData { Success = result };

            }
            catch (Exception)
            {
                return new ResponseData { Success = false, Message = "Bad request" };
            }
        }

        /// <summary>
        /// Multiple File Upload
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        [HttpPost("PostMultipleFile")]
        public async Task<ResponseData> PostMultipleFile([FromForm] List<FileUpload> fileDetails)
        {
            if (fileDetails == null)
            {
                return new ResponseData { Success = false, Message = "Empty" };
            }
            try
            {
                var result = await _uploadService.PostMultiFileAsync(fileDetails);
                return new ResponseData { Success = result };
            }
            catch (Exception)
            {
                return new ResponseData { Success = false, Message = "Bad request" };
            }
        }

        /// <summary>
        /// Download File
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        [HttpGet("DownloadFile")]
        public async Task<ResponseData> DownloadFile(int id)
        {
            if (id < 1)
            {
                return new ResponseData { Success = false, Message = "Bad request" };
            }

            try
            {
                var result = await _uploadService.DownloadFileById(id);

                return new ResponseData { Success = true, Data = result };
            }
            catch (Exception)
            {
                return new ResponseData { Success = false, Message = "Bad request" };
            }
        }

        /// <summary>
        /// Download Item File
        /// </summary>
        /// <param name="itemId"></param>
        /// <param name="itemType"></param>
        /// <returns></returns>
        [HttpGet("DownloadItemFile")]
        public async Task<ResponseData> DownloadFile(int itemId, int itemType)
        {
            if (itemId < 1 || itemType < 1)
            {
                return new ResponseData { Success = false, Message = "Bad request" };
            }

            try
            {
                var result = await _uploadService.DownloadFileByItem(itemId, itemType);

                return new ResponseData { Success = true, Data = result };
            }
            catch (Exception)
            {
                return new ResponseData { Success = false, Message = "Bad request" };
            }
        }
    }
}
