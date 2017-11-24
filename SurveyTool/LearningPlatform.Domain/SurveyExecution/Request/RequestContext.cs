using System.Globalization;
using LearningPlatform.Domain.Respondents;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyLayout;
using LearningPlatform.Domain.SurveyPublishing;
using LearningPlatform.Domain.SurveyThemes;
using Newtonsoft.Json.Linq;

namespace LearningPlatform.Domain.SurveyExecution.Request
{
    public class RequestContext : IRequestContext
    {
        public Survey Survey { get; set; }
        public Respondent Respondent { get; set; }
        public JObject CustomColumns { get; set; }
        public RequestState State { get; set; }
        public INodeService NodeService { get; set; }
        public Layout SurveyLayout { get; set; }
        public bool IsTesting { get; set; }
        public Direction Direction { get; set; }
        public Theme SurveyTheme { get; set; }
        public bool IsResume { get; set; }
        public string[] UserLanguages { get; set; }

        public bool IsForward => Direction == Direction.Forward || Direction == Direction.FirstPage;
        public SurveyAndLayout SurveyAndLayout { get; set; }
    }
}