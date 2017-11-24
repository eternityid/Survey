namespace LearningPlatform.Domain.Respondents
{
    public class RespondentSearchFilter
    {
        public string SurveyId { get; set; }
        public string EmailAddress { get; set; }
        public string ResponseStatus { get; set; }
        public int NumberSent { get; set; }
        public int NumberSentTo { get; set; }
        public string NumberSentOperator { get; set; }
        public string LastTimeSentOperator { get; set; }
        public string LastTimeSent { get; set; }
        public string LastTimeSentTo { get; set; }
        public string CompletedTimeSentTo { get; set; }
        public string CompletedTimeSent { get; set; }
        public string CompletedTimeSentOperator { get; set; }
    }
}
