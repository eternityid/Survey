namespace LearningPlatform.Application.Models
{
    public class SendRespondentForm
    {
        public SearchRespondentsModel SearchModel { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
    }
}