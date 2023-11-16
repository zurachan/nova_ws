using API.Common;
using API.Model.Management;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Management
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        /// <summary>
        /// Single File Upload
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        [HttpPost("PostSingleFile")]
        public async Task<Response<byte[]>> PostSingleFile([FromForm] FileRequest fileUpload)
        {
            if (fileUpload.FormFile == null)
            {
                return new Response<byte[]> { Success = false, Message = "Empty" };
            }
            try
            {
                var result = new FileResponse();

                using (var stream = new MemoryStream())
                {
                    fileUpload.FormFile.CopyTo(stream);
                    result.FileData = stream.ToArray();
                }

                return new Response<byte[]>(result.FileData);

            }
            catch (Exception)
            {
                return new Response<byte[]> { Success = false, Message = "Bad request" };
            }
        }
    }
}
