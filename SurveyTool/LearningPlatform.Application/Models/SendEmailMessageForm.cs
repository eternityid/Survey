namespace LearningPlatform.Application.Models
{
    public class SendEmailMessageForm
    {
        public string[] EmailAddresses { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
    }
}