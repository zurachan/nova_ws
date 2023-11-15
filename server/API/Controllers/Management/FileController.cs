using API.Common;
using API.Domains;
using API.Model.Management;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers.Management
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IFileService _uploadService;
        private readonly AppDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        int UserId;

        public FileController(IFileService uploadService, AppDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _uploadService = uploadService;
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            var value = _httpContextAccessor.HttpContext.User.FindFirstValue("UserId");
            UserId = value != null ? int.Parse(value) : 0;
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

                switch (fileDetails.ItemType)
                {
                    case (int)ItemType.User:
                        var user = _context.Users.FirstOrDefault(x => x.Id == fileDetails.ItemId && !x.IsDeleted);
                        if (user != null)
                        {
                            user.PathImage = result;
                            user.UpdatedDate = DateTime.Now;
                        }
                        break;
                    case (int)ItemType.Project:
                        var project = _context.Projects.FirstOrDefault(x => x.Id == fileDetails.ItemId && !x.IsDeleted);
                        if (project != null)
                        {
                            project.PathImage = result;
                            project.UpdatedDate = DateTime.Now;
                        }
                        break;
                    case (int)ItemType.Content:
                        var content = _context.Contents.FirstOrDefault(x => x.Id == fileDetails.ItemId && !x.IsDeleted);
                        if (content != null)
                        {
                            content.PathImage = result;
                            content.UpdatedDate = DateTime.Now;
                        }
                        break;
                    case (int)ItemType.Event:
                        var event1 = _context.Events.FirstOrDefault(x => x.Id == fileDetails.ItemId && !x.IsDeleted);
                        if (event1 != null)
                        {
                            event1.PathImage = result;
                            event1.UpdatedDate = DateTime.Now;
                        }
                        break;
                    case (int)ItemType.Partner:
                        var partner = _context.Partners.FirstOrDefault(x => x.Id == fileDetails.ItemId && !x.IsDeleted);
                        if (partner != null)
                        {
                            partner.PathImage = result;
                            partner.UpdatedDate = DateTime.Now;
                        }
                        break;
                }

                await _context.SaveChangesAsync();

                return new Response<bool> { Success = true };

            }
            catch (Exception)
            {
                return new Response<bool> { Success = false, Message = "Bad request" };
            }
        }

        ///// <summary>
        ///// Multiple File Upload
        ///// </summary>
        ///// <param name="file"></param>
        ///// <returns></returns>
        //[HttpPost("PostMultipleFile")]
        //public async Task<Response<bool>> PostMultipleFile([FromForm] MultiFileUpload listFiles)
        //{
        //    if (!listFiles.FileDetails.Any())
        //    {
        //        return new Response<bool> { Success = false, Message = "Empty" };
        //    }
        //    try
        //    {
        //        var result = await _uploadService.PostMultiFileAsync(listFiles);
        //        return new Response<bool> { Success = true };
        //    }
        //    catch (Exception)
        //    {
        //        return new Response<bool> { Success = false, Message = "Bad request" };
        //    }
        //}

        ///// <summary>
        ///// Download File
        ///// </summary>
        ///// <param name="file"></param>
        ///// <returns></returns>
        //[HttpGet("DownloadFile")]
        //public async Task<Response<FileResponse>> DownloadFile(int id)
        //{
        //    if (id < 1)
        //    {
        //        return new Response<FileResponse> { Success = false, Message = "Bad request" };
        //    }

        //    try
        //    {
        //        var result = await _uploadService.DownloadFileById(id);

        //        return new Response<FileResponse>(result);
        //    }
        //    catch (Exception)
        //    {
        //        return new Response<FileResponse> { Success = false, Message = "Bad request" };
        //    }
        //}

        ///// <summary>
        ///// Download Item File
        ///// </summary>
        ///// <param name="itemId"></param>
        ///// <param name="itemType"></param>
        ///// <returns></returns>
        //[HttpGet("DownloadItemFile")]
        //public async Task<Response<List<FileResponse>>> DownloadItemFile(int itemId, int itemType)
        //{
        //    if (itemId < 1 || itemType < 1)
        //    {
        //        return new Response<List<FileResponse>> { Success = false, Message = "Bad request" };
        //    }

        //    try
        //    {
        //        var result = await _uploadService.DownloadFileByItem(itemId, itemType);

        //        return new Response<List<FileResponse>>(result);
        //    }
        //    catch (Exception)
        //    {
        //        return new Response<List<FileResponse>> { Success = false, Message = "Bad request" };
        //    }
        //}
    }
}
