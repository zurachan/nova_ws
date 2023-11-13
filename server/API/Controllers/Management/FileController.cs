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
        public async Task<Response<bool>> PostSingleFile([FromForm] FileUpload fileDetails)
        {
            if (fileDetails == null)
            {
                return new Response<bool> { Success = false, Message = "Empty" };
            }
            try
            {
                var result = await _uploadService.PostFileAsync(fileDetails);
                return new Response<bool> { Success = result };

            }
            catch (Exception)
            {
                return new Response<bool> { Success = false, Message = "Bad request" };
            }
        }

        /// <summary>
        /// Multiple File Upload
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        [HttpPost("PostMultipleFile")]
        public async Task<Response<bool>> PostMultipleFile([FromForm] MultiFileUpload listFiles)
        {
            if (!listFiles.FileDetails.Any())
            {
                return new Response<bool> { Success = false, Message = "Empty" };
            }
            try
            {
                var result = await _uploadService.PostMultiFileAsync(listFiles);
                return new Response<bool> { Success = true };
            }
            catch (Exception)
            {
                return new Response<bool> { Success = false, Message = "Bad request" };
            }
        }

        /// <summary>
        /// Download File
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        [HttpGet("DownloadFile")]
        public async Task<Response<FileResponse>> DownloadFile(int id)
        {
            if (id < 1)
            {
                return new Response<FileResponse> { Success = false, Message = "Bad request" };
            }

            try
            {
                var result = await _uploadService.DownloadFileById(id);

                return new Response<FileResponse>(result);
            }
            catch (Exception)
            {
                return new Response<FileResponse> { Success = false, Message = "Bad request" };
            }
        }

        /// <summary>
        /// Download Item File
        /// </summary>
        /// <param name="itemId"></param>
        /// <param name="itemType"></param>
        /// <returns></returns>
        [HttpGet("DownloadItemFile")]
        public async Task<Response<List<FileResponse>>> DownloadItemFile(int itemId, int itemType)
        {
            if (itemId < 1 || itemType < 1)
            {
                return new Response<List<FileResponse>> { Success = false, Message = "Bad request" };
            }

            try
            {
                var result = await _uploadService.DownloadFileByItem(itemId, itemType);

                return new Response<List<FileResponse>>(result);
            }
            catch (Exception)
            {
                return new Response<List<FileResponse>> { Success = false, Message = "Bad request" };
            }
        }
    }
}
