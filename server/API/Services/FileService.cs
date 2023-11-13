using API.Domains;
using API.Model.Management;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using File = API.Domains.File;

namespace API.Services
{
    public interface IFileService
    {
        Task<bool> PostFileAsync(FileUpload fileUpload);

        Task<bool> PostMultiFileAsync(MultiFileUpload listFile);

        Task<List<FileResponse>> DownloadFileByItem(int itemId, int itemType);

        Task<FileResponse> DownloadFileById(int Id);
    }
    public class FileService : IFileService
    {
        private readonly AppDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        int UserId;

        public FileService(AppDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            UserId = int.Parse(_httpContextAccessor.HttpContext?.User.FindFirstValue("UserId"));
        }

        public async Task<bool> PostFileAsync(FileUpload fileUpload)
        {
            try
            {
                if (fileUpload.Id != 0)
                {
                    var domain = await _context.Files.FirstOrDefaultAsync(x => x.Id == fileUpload.Id && !x.IsDeleted);
                    if (domain == null) { return false; }

                    domain.FileName = Guid.NewGuid().ToString() + fileUpload.FileDetails.FileName;
                    using (var stream = new MemoryStream())
                    {
                        fileUpload.FileDetails.CopyTo(stream);
                        domain.FileData = stream.ToArray();
                    }
                }
                else
                {
                    Guid guid = Guid.NewGuid();
                    var file = new File
                    {
                        FileName = guid.ToString() + fileUpload.FileDetails.FileName,
                        ItemId = fileUpload.ItemId,
                        ItemType = fileUpload.ItemType,
                    };

                    using (var stream = new MemoryStream())
                    {
                        fileUpload.FileDetails.CopyTo(stream);
                        file.FileData = stream.ToArray();
                    }

                    _context.Files.Add(file);
                }
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> PostMultiFileAsync(MultiFileUpload listFile)
        {
            try
            {
                var existed = await _context.Files.Where(x => x.ItemId == listFile.ItemId && x.ItemType == listFile.ItemType).ToListAsync();
                if (existed.Any())
                {
                    existed.ForEach(x =>
                    {
                        x.IsDeleted = true;
                        x.UpdatedDate = DateTime.Now;
                        x.UpdatedById = UserId;
                    });
                }

                listFile.FileDetails.ForEach(x =>
                {
                    Guid guid = Guid.NewGuid();
                    var file = new File
                    {
                        FileName = guid.ToString() + x.FileName,
                        ItemId = listFile.ItemId,
                        ItemType = listFile.ItemType,
                        CreatedById = UserId,
                        CreatedDate = DateTime.Now,
                    };

                    using (var stream = new MemoryStream())
                    {
                        x.CopyTo(stream);
                        file.FileData = stream.ToArray();
                    }

                    _context.Files.Add(file);

                });

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<List<FileResponse>> DownloadFileByItem(int itemId, int itemType)
        {
            try
            {
                var files = await _context.Files.Where(x => x.ItemId == itemId && x.ItemType == itemType && !x.IsDeleted).ToListAsync();
                var pathRoot = Directory.GetCurrentDirectory();
                var pathArr = pathRoot.Split("server", StringSplitOptions.None);
                var uploadFolder = pathArr[0] + "upload";
                Directory.CreateDirectory(uploadFolder);

                var result = new List<FileResponse>();
                foreach (var file in files)
                {
                    var content = new MemoryStream(file.FileData);
                    var path = Path.Combine(uploadFolder, file.FileName);
                    await CopyStream(content, path);
                    var fileResponse = new FileResponse
                    {
                        Id = file.Id,
                        FileName = file.FileName,
                        FilePath = file.FileName,
                    };

                    result.Add(fileResponse);
                }

                return result;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<FileResponse> DownloadFileById(int Id)
        {
            try
            {
                var file = _context.Files.FirstOrDefaultAsync(x => x.Id == Id);
                var pathRoot = Directory.GetCurrentDirectory();
                var pathArr = pathRoot.Split("server", StringSplitOptions.None);
                var uploadFolder = pathArr[0] + "upload";
                Directory.CreateDirectory(uploadFolder);

                var content = new MemoryStream(file.Result.FileData);
                var path = Path.Combine(uploadFolder, file.Result.FileName);
                await CopyStream(content, path);

                return new FileResponse
                {
                    FileName = file.Result.FileName,
                    FilePath = file.Result.FileName,
                };
            }
            catch (Exception)
            {
                return null;
            }
        }

        private async Task CopyStream(Stream stream, string downloadPath)
        {
            using (var fileStream = new FileStream(downloadPath, FileMode.Create, FileAccess.Write))
            {
                await stream.CopyToAsync(fileStream);
            }
        }
    }
}
