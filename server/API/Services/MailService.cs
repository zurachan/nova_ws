using API.Domains.Business;
using Microsoft.Extensions.Options;
using MimeKit;
using System.Net;
using System.Net.Mail;

namespace API.Services
{
    public interface IMailService
    {
        Task<bool> SendMailConfirmSubcribe(Customer customer, Project? project);

        Task<bool> SendMailUpdateProgress(List<Customer> customers, Project project);

        Task<bool> SendMailNewProject(List<Customer> customers);
    }

    public class MailService : IMailService
    {
        private readonly MailSetting _mailSetting;
        public MailService(IOptions<MailSetting> mailSetting)
        {
            _mailSetting = mailSetting.Value;
        }

        public async Task<bool> SendMailConfirmSubcribe(Customer customer, Project? project)
        {
            try
            {
                var subject = "ĐĂNG KÝ NHẬN THÔNG TIN";
                var content = "";

                if (project != null)
                {
                    content = "<p>Kính gửi Ông/Bà {0},</p>" +
                        "<p><b>Quý khách đăng ký nhận thông tin về dự án {1} thành công.</b></p>" +
                        "<p>Cảm ơn sự quan tâm của quý khách về dự án {1} của NOVA GROUP. Chúng tôi sẽ gửi mail thông báo cho quý khách khi dự án có cập nhật tiến độ. Nếu có bất kỳ thắc mắc nào về dự án hãy liên hệ với chúng tôi để được giải đáp.</p>" +
                        "<p><i>Cám ơn sự đồng khách của quý khách với NOVA GROUP.</i></p>";
                }
                else
                {
                    content = "<p>Kính gửi Ông/Bà {0},</p>" +
                        "<p><b>Quý khách đăng ký nhận thông tin khi có dự án mới thành công.</b></p>" +
                        "<p>Cảm ơn sự quan tâm của quý khách đối với các dự án của của NOVA GROUP. Chúng tôi sẽ gửi mail thông báo cho quý khách khi có dự án mới. Nếu có bất kỳ thắc mắc nào về dự án hãy liên hệ với chúng tôi để được giải đáp.</p>" +
                        "<p><i>Cám ơn sự đồng khách của quý khách với NOVA GROUP.</i></p>";
                }
                var body = string.Format(content, customer.FullName, project.Name);

                using var smtp = new SmtpClient(_mailSetting.Host, _mailSetting.Port);

                smtp.EnableSsl = _mailSetting.EnableSsl;
                smtp.Credentials = new NetworkCredential(_mailSetting.Email, _mailSetting.Password);

                var mail = new MailMessage(_mailSetting.Email, customer.Email, subject, body);
                mail.IsBodyHtml = true;

                await smtp.SendMailAsync(mail);

                smtp.Dispose();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> SendMailNewProject(List<Customer> customers)
        {
            try
            {
                var subject = "THÔNG BÁO DỰ ÁN MỚI";
                var content = "<p>Kính gửi Quý khách,</p>" +
                        "<p><b>NOVA GROUP xin thông báo đã có dự án mới.</b></p>" +
                        "<p>Quý khách có thể truy cập website để xem thông tin mới nhất về dự án. Nếu có bất kỳ thắc mắc nào về dự án hãy liên hệ với chúng tôi để được giải đáp.</p>" +
                        "<p><i>Cám ơn sự đồng khách của quý khách với NOVA GROUP.</i></p>";

                using var smtp = new SmtpClient(_mailSetting.Host, _mailSetting.Port);
                smtp.EnableSsl = _mailSetting.EnableSsl;
                smtp.Credentials = new NetworkCredential(_mailSetting.Email, _mailSetting.Password);

                var mail = new MailMessage();
                mail.From = new MailAddress(_mailSetting.Email);
                mail.Subject = subject;
                mail.Body = content;
                mail.IsBodyHtml = true;

                customers.ForEach(x =>
                {
                    mail.To.Add(new MailAddress(x.Email));
                });

                await smtp.SendMailAsync(mail);

                smtp.Dispose();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> SendMailUpdateProgress(List<Customer> customers, Project project)
        {
            try
            {
                var subject = "THÔNG BÁO CẬP NHẬT TIẾN ĐỘ DỰ ÁN";
                var content = "<p>Kính gửi Quý khách,</p>" +
                        "<p><b>NOVA GROUP xin thông báo dự án {0} đã được cập nhật tiến độ.</b></p>" +
                        "<p>Quý khách có thể truy cập website để xem thông tin mới nhất về dự án. Nếu có bất kỳ thắc mắc nào về dự án hãy liên hệ với chúng tôi để được giải đáp.</p>" +
                        "<p><i>Cám ơn sự đồng khách của quý khách với NOVA GROUP.</i></p>";
                var body = string.Format(content, project.Name);

                using var smtp = new SmtpClient(_mailSetting.Host, _mailSetting.Port);
                smtp.EnableSsl = _mailSetting.EnableSsl;
                smtp.Credentials = new NetworkCredential(_mailSetting.Email, _mailSetting.Password);

                var mail = new MailMessage();
                mail.From = new MailAddress(_mailSetting.Email);
                mail.Subject = subject;
                mail.Body = body;
                mail.IsBodyHtml = true;

                customers.ForEach(x =>
                {
                    mail.To.Add(new MailAddress(x.Email));
                });

                await smtp.SendMailAsync(mail);

                smtp.Dispose();
                return true;
            }
            catch
            {
                return false;
            }
        }
    }

    public class MailSetting
    {
        public string SenderName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Host { get; set; }
        public int Port { get; set; }
        public bool EnableSsl { get; set; }
    }
}
