namespace LearningPlatform.Domain.SurveyDesign.Services.Survey
{
    public interface IReadSurveyService
    {
        Domain.SurveyDesign.Survey GetFullSurvey(string surveyId);
        Domain.SurveyDesign.Survey GetFullLibrarySurvey(string libraryId, string surveyId);
        void PopulateSurveyContent(Domain.SurveyDesign.Survey survey);
    }
}