using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Respondents;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyExecution.Request;
using LearningPlatform.Domain.SurveyPublishing;
using System.Web;

namespace LearningPlatform.Domain.SurveyExecution.Engine
{
    public class RequestInitializer
    {
        private readonly INodeServiceCache _nodeServiceCache;
        private readonly IRequestObjectProvider<IRequestContext> _requestContextProvider;
        private readonly LanguageService _languageService;

        public RequestInitializer(INodeServiceCache nodeServiceCache, IRequestObjectProvider<IRequestContext> requestContextProvider, LanguageService languageService)
        {
            _nodeServiceCache = nodeServiceCache;
            _requestContextProvider = requestContextProvider;
            _languageService = languageService;
        }

        public IRequestContext Initialize(SurveyAndLayout surveyAndLayout, Direction direction)
        {
            var survey = surveyAndLayout.Survey;
            var requestContext = new RequestContext
            {
                NodeService = _nodeServiceCache.Get(survey),
                Survey = survey,
                IsTesting = surveyAndLayout.IsTesting,
                SurveyLayout = surveyAndLayout.Layout,
                SurveyTheme = surveyAndLayout.Theme,
                SurveyAndLayout = surveyAndLayout,
                Direction = direction,
                State = new RequestState(),
                UserLanguages = HttpContext.Current==null?new string[0]:_languageService.GetExpandedUserLanguages(HttpContext.Current.Request.UserLanguages)
            };
            _requestContextProvider.Set(requestContext);
            return requestContext;
        }

        public RequestContext Initialize(Survey survey, Respondent respondent) {
            var requestContext = new RequestContext
            {
                Survey = survey,
                State = new RequestState(),
                Respondent = respondent
            };
            _requestContextProvider.Set(requestContext);
            return requestContext;
        }
    }
}
