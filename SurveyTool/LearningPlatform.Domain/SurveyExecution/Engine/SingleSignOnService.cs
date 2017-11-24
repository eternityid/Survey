using System.Web;
using System.Configuration;
using System.Security.Claims;

namespace LearningPlatform.Domain.SurveyExecution.Engine
{
    public class SingleSignOnService
    {
        private readonly RespondentService _respondentService;

        public SingleSignOnService(RespondentService respondentService)
        {
            _respondentService = respondentService;
        }

        public void Challenge()
        {
            HttpContext.Current.GetOwinContext()
                .Authentication.Challenge(ConfigurationManager.AppSettings["ida:SignInPolicyId"]);
        }

        public Respondents.Respondent GetRespondent(SurveyDesign.Survey survey, bool isTesting)
        {
            var user = HttpContext.Current.User as ClaimsPrincipal;
            var externalId = user.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier").Value;
            var email = user.FindFirst("emails").Value;
            var respondent = _respondentService.GetExistingExternalRespondent(externalId, survey.Id, isTesting);
            if (respondent == null)
            {
                respondent = _respondentService.CreateNewRespondent(survey.Id, isTesting, email, externalId);
            }
            else
            {
                respondent.EmailAddress = email;
            }
            return respondent;            
        }
    }
}