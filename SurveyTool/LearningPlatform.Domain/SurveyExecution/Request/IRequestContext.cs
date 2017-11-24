using LearningPlatform.Domain.Respondents;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyLayout;
using LearningPlatform.Domain.SurveyPublishing;
using LearningPlatform.Domain.SurveyThemes;
using Newtonsoft.Json.Linq;

namespace LearningPlatform.Domain.SurveyExecution.Request
{
    public interface IRequestContext
    {
        Survey Survey { get; }
        Respondent Respondent { get; set; }
        JObject CustomColumns { get; set; }
        RequestState State { get; set; }
        INodeService NodeService { get; }
        Layout SurveyLayout { get; }
        bool IsTesting { get; }
        Theme SurveyTheme { get; }
        bool IsResume { get; set; }
        Direction Direction { get; set; }
        bool IsForward { get; }
        string[] UserLanguages { get;}
        SurveyAndLayout SurveyAndLayout { get; }
    }
}