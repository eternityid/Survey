using System;
using System.Globalization;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Respondents;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyLayout;
using LearningPlatform.Domain.SurveyPublishing;
using LearningPlatform.Domain.SurveyThemes;
using Newtonsoft.Json.Linq;

namespace LearningPlatform.Domain.SurveyExecution.Request
{
    public class RequestContextWrapper : IRequestContext
    {
        private readonly IRequestObjectProvider<IRequestContext> _requestContextProvider;

        public RequestContextWrapper(IRequestObjectProvider<IRequestContext> requestContextProvider)
        {
            _requestContextProvider = requestContextProvider;
        }

        public Survey Survey
        {
            get {
                return _requestContextProvider.Get().Survey;
            }
        }

        public Respondent Respondent
        {
            get {
                return _requestContextProvider.Get().Respondent;
            }
            set { _requestContextProvider.Get().Respondent = value; }
        }

        public JObject CustomColumns { get; set; }

        public RequestState State
        {
            get { return _requestContextProvider.Get().State; }
            set { _requestContextProvider.Get().State = value; }
        }

        public INodeService NodeService
        {
            get { return _requestContextProvider.Get().NodeService; }
        }

        public Layout SurveyLayout
        {
            get { return _requestContextProvider.Get().SurveyLayout; }
        }

        public Theme SurveyTheme
        {
            get { return _requestContextProvider.Get().SurveyTheme; }
        }

        public bool IsResume {
            get { return _requestContextProvider.Get().IsResume; }
            set { _requestContextProvider.Get().IsResume = value; }
        }

        public Direction Direction
        {
            get { return _requestContextProvider.Get().Direction; }
            set { _requestContextProvider.Get().Direction = value; }
        }

        public bool IsTesting
        {
            get { return _requestContextProvider.Get().IsTesting; }
        }

        public bool IsForward
        {
            get { return _requestContextProvider.Get().IsForward; }
        }

        public string[] UserLanguages
        {
            get { return _requestContextProvider.Get().UserLanguages; }
        }

        public SurveyAndLayout SurveyAndLayout => _requestContextProvider.Get().SurveyAndLayout;

    }
}