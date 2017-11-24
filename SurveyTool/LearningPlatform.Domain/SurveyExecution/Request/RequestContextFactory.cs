using LearningPlatform.Domain.Respondents;
using LearningPlatform.Domain.SurveyExecution.Engine;
using LearningPlatform.Domain.SurveyPublishing;

namespace LearningPlatform.Domain.SurveyExecution.Request
{
    public class RequestContextFactory
    {
        private readonly INodeServiceCache _nodeServiceCache;

        public RequestContextFactory(INodeServiceCache nodeServiceCache)
        {
            _nodeServiceCache = nodeServiceCache;
        }

        public RequestContext Create(SurveyAndLayout surveyAndLayout, Respondent respondent, Direction direction, bool resume=false)
        {
            var survey = surveyAndLayout.Survey;
            var requestContext = new RequestContext
            {
                NodeService = _nodeServiceCache.Get(survey),
                Survey = survey,
                IsTesting = surveyAndLayout.IsTesting,
                SurveyLayout = surveyAndLayout.Layout,
                Respondent = respondent,
                SurveyTheme = surveyAndLayout.Theme,
                IsResume = resume,
                Direction = direction,
                SurveyAndLayout =  surveyAndLayout
            };

            if (respondent != null)
            {
                requestContext.State = new RequestState();
            }
            return requestContext;
        }
    }
}