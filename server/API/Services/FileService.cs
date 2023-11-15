using API.Domains;
using API.Domains.Management;
using API.Model.Management;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using File = API.Domains.File;

namespace API.Services
{
    public interface IFileService
    {
        Task<string> PostFileAsync(FileUpload fileUpload);

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
            var value = _httpContextAccessor.HttpContext.User.FindFirstValue("UserId");
            UserId = value != null ? int.Parse(value) : 0;
        }

        public async Task<string> PostFileAsync(FileUpload fileUpload)
        {
            try
            {
                var domain = await _context.Files.FirstOrDefaultAsync(x => x.ItemId == fileUpload.ItemId && x.ItemType == fileUpload.ItemType && !x.IsDeleted);
                if (domain != null)
                {
                    domain.FileName = Guid.NewGuid().ToString() + fileUpload.FileDetails.FileName;
                    domain.UpdatedDate = DateTime.Now;
                    domain.UpdatedById = UserId;

                    using (var stream = new MemoryStream())
                    {
                        fileUpload.FileDetails.CopyTo(stream);
                        domain.FileData = stream.ToArray();
                    }
                }
                else
                {
                    Guid guid = Guid.NewGuid();
                    domain = new File
                    {
                        FileName = guid.ToString() + fileUpload.FileDetails.FileName,
                        ItemId = fileUpload.ItemId,
                        ItemType = fileUpload.ItemType,
                        CreatedDate = DateTime.Now,
                        CreatedById = UserId,
                    };

                    using (var stream = new MemoryStream())
                    {
                        fileUpload.FileDetails.CopyTo(stream);
                        domain.FileData = stream.ToArray();
                    }
                    _context.Files.Add(domain);
                }

                await _context.SaveChangesAsync();

                var pathRoot = Directory.GetCurrentDirectory();
                var pathArr = pathRoot.Split("server", StringSplitOptions.None);
                var uploadFolder = pathArr[0] + "upload";

                Directory.CreateDirectory(uploadFolder);
                var path = Path.Combine(uploadFolder, domain.FileName);
                var content = new MemoryStream(domain.FileData);
                await CopyStream(content, path);

                return domain.FileName;
            }
            catch (Exception)
            {
                throw;
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
                        CreatedDate = DateTime.Now,
                        CreatedById = UserId,
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
