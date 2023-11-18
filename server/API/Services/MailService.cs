using API.Domains.Business;

namespace API.Services
{
    public interface IMailService
    {
        bool SendMailConfirmSubcribe(Project? project);

        bool SendMailUpdateProgress(Project project);

        bool SendMailNewProject();
    }

    public class MailService : IMailService
    {
        public bool SendMailConfirmSubcribe(Project? project)
        {
            throw new NotImplementedException();
        }

        public bool SendMailNewProject()
        {
            throw new NotImplementedException();
        }

        public bool SendMailUpdateProgress(Project project)
        {
            throw new NotImplementedException();
        }
    }
}
