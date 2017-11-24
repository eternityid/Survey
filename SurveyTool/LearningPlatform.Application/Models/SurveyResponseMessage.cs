namespace LearningPlatform.Application.Models
{
    public class SurveyResponseMessage
    {
        public SurveyResponseMessage(bool status, string message)
        {
            this.Status = status;
            this.Message = message;
        }
        public bool Status { get; set; }
        public string Message { get; set; }
    }
}