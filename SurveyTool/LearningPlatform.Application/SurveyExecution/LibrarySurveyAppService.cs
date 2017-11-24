using LearningPlatform.Application.SurveyExecution.Models;
using LearningPlatform.Domain.SurveyDesign.Services.Survey;
using LearningPlatform.Domain.SurveyExecution;
using LearningPlatform.Domain.SurveyExecution.Request;
using System.Collections.Specialized;

namespace LearningPlatform.Application.SurveyExecution
{
    public class LibrarySurveyAppService
    {
        private readonly LibrarySurveyService _librarySurveyService;
        private readonly IRequestContext _requestContext;
        private readonly LookAndFeelAppService _lookAndFeelAppService;

        public LibrarySurveyAppService(
            LibrarySurveyService librarySurveyService,
            IRequestContext requestContext,
            LookAndFeelAppService lookAndFeelAppService)
        {
            _librarySurveyService = librarySurveyService;
            _requestContext = requestContext;
            _lookAndFeelAppService = lookAndFeelAppService;
        }

        public Page BeginSurvey(string libraryId, string surveyId)
        {
            return _librarySurveyService.BeginSurvey(libraryId, surveyId);
        }

        public Page Navigate(string libraryId, string surveyId, Direction direction, NameValueCollection nameValueCollection)
        {
            return _librarySurveyService.Navigate(libraryId, surveyId, direction, nameValueCollection);
        }

        public LayoutAndThemeModel GetLayoutAndThemeByPageId(string pageId)
        {
            if (pageId == null)
            {
                return new LayoutAndThemeModel
                {
                    Layout = _requestContext.SurveyLayout,
                    Theme = _requestContext.SurveyTheme
                };
            }
            var pageDefinition = _requestContext.NodeService.GetPageDefinition(pageId);
            return _lookAndFeelAppService.MergeLayoutAndTheme(pageDefinition, _requestContext.SurveyAndLayout);
        }

    }
}
