using API.Domains.Management;

namespace API.Model.Management
{
    public class AuthenResponse
    {
        public object? User { get; set; }
        public object? Role { get; set; }
        public string? Token { get; set; }
        public bool Success { get; set; }
        public string? Message { get; set; }
    }
}
