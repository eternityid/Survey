using LearningPlatform.Domain.SurveyExecution.Request;
using LearningPlatform.Domain.SurveyExecution.Security;
using System;
using System.Configuration;
using System.Web;

namespace LearningPlatform.Domain.Respondents
{
    public class RespondentUrlService
    {
        public string GetRespondentSecurityQueryParameter(Respondent respondent)
        {
            var p = new ProtectedVariables
            {
                Credential = respondent.Credential,
                RespondentId = respondent.Id,
                Ticks = DateTime.UtcNow.Ticks
            };
            return HttpUtility.UrlEncode(VariablesProtector.Protect(p, "external"));
        }

        public string GetRedirectRespondentSecurityQueryParameter(IRequestContext requestContext)
        {
            var p = new ProtectedVariables
            {
                PageId = requestContext.Respondent.CurrentPageId,
                Credential = requestContext.Respondent.Credential,
                RespondentId = requestContext.Respondent.Id,
                LoopStack = requestContext.State.LoopState.ToString(),

                Ticks = DateTime.UtcNow.Ticks
            };
            return HttpUtility.UrlEncode(VariablesProtector.Protect(p, "external"));
        }

        public string GetRedirectSurveyLink(IRequestContext requestContext)
        {
            string externalLink = GetRedirectRespondentSecurityQueryParameter(requestContext);
            return GetSurveyLink(requestContext.Survey.Id, requestContext.IsTesting, externalLink);
        }

        public string GetSurveyLink(string surveyId, bool isTesting, Respondent respondent)
        {
            string externalLink = GetRespondentSecurityQueryParameter(respondent);
            return GetSurveyLink(surveyId, isTesting, externalLink);
        }

        public string GetSurveyLink(string surveyId, bool isTesting, string securityQueryParameter)
        {
            var baseUrl = SurveyUrl + "survey/";
            if (isTesting)
            {
                baseUrl += "test/";
            }
            return $"{baseUrl}{surveyId}?s={securityQueryParameter}";
        }

        private static string SurveyUrl => ConfigurationManager.AppSettings["SurveyUrl"];
    }
}