
namespace LearningPlatform.Domain.SurveyDesign.ExportResponses
{
    public class ExportResponsesSettings
    {
        public ExportResponsesReadingMode ExportResponsesReadingMode { get; set; }
        public ExportResponsesInclude ExportResponsesInclude { get; set; }
        public ExportResponsesSeparator ExportResponsesSeparator { get; set; }
        public bool MultipleSelectionAnswersAsSeparateColumns { get; set; }
    }

}
