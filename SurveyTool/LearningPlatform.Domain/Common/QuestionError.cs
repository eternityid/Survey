namespace LearningPlatform.Domain.Common
{
    public class QuestionError
    {
        public QuestionError(string type, string message)
        {
            Type = type;
            Message = message;
        }
        public string Type { get; set; }
        public string Message { get; set; }
    }
}
