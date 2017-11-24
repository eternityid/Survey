namespace LearningPlatform.Domain.Reporting.Respondents
{
    public class SurveyResultAggregatedRespondents : AggregatedRespondents
    {
        public SurveyResultAggregatedRespondents(AggregatedRespondents aggregatedRespondents)
        {
            SurveyName = aggregatedRespondents.SurveyName;
            TotalRespondents = aggregatedRespondents.TotalRespondents;
            Questions = aggregatedRespondents.Questions;
        }
        public bool IsDisplaySummaryTabular { get; set; }
        public long ReportPageId { get; set; }
    }
}
