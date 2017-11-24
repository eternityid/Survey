namespace LearningPlatform.Domain.Reporting.Respondents
{
    public class AggregatedQuestion
    {
        public string Id { get; set; }
        public string QuestionName { get; set; }
        public int QuestionType { get; set; }
        public string QuestionText { get; set; }
        public int NumberOfRespondents { get; set; }
        public int NumberOfResponses { get; set; }
        public AggregatedQuestionSetting QuestionSetting { get; set; }
    }
}
