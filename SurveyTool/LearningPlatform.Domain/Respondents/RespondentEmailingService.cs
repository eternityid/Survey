using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyExecution.Engine;
using LearningPlatform.Domain.SurveyExecution.RepositoryContracts;
using LearningPlatform.Domain.SurveyExecution.Scripting;
using LearningPlatform.Domain.SurveyExecution.Security;
using LearningPlatform.Domain.UtilServices;
using System;
using System.Collections.Generic;

namespace LearningPlatform.Domain.Respondents
{
    public class RespondentEmailingService
    {
        private readonly IRespondentSurveyExecutionRepository _respondentSurveyExecutionRepository;
        private readonly IRespondentRepository _respondentRepository;
        private readonly ISurveyRepository _surveyRepository;
        private readonly RespondentUrlService _urlService;
        private readonly IScriptExecutor _scriptExecutor;
        private readonly RequestInitializer _requestInitializer;

        public RespondentEmailingService(IRespondentSurveyExecutionRepository respondentSurveyExecutionRepository,
            IRespondentRepository respondentRepository,
            RespondentUrlService urlService,
            IScriptExecutor scriptExecutor,
            RequestInitializer requestInitializer,
            ISurveyRepository surveyRepository)
        {
            _respondentSurveyExecutionRepository = respondentSurveyExecutionRepository;
            _respondentRepository = respondentRepository;
            _urlService = urlService;
            _scriptExecutor = scriptExecutor;
            _requestInitializer = requestInitializer;
            _surveyRepository = surveyRepository;
        }
        public void SendEmailToRespondents(string surveyId, string subject, string content, List<Respondent> respodents, bool isTesting)
        {
            if (respodents == null || respodents.Count < 1) return;
            var survey = _surveyRepository.GetById(surveyId);
            foreach (var respondent in respodents)
            {
                HandleSendEmail(survey, subject, content, respondent, isTesting);
            }
        }

        public void SendInvitationEmailToRespondents(string surveyId, string subject, string content, string[] emailAddresses, bool isTesting)
        {
            var survey = _surveyRepository.GetById(surveyId);
            foreach (string emailAddress in emailAddresses)
            {
                Respondent respondent = InitiateNewRespondent(surveyId, emailAddress, isTesting);
                HandleSendEmail(survey, subject, content, respondent, isTesting);
            }
        }
        private Respondent InitiateNewRespondent(string surveyId, string emailAddress, bool isTesting)
        {
            var respondent = _respondentRepository.Get(surveyId, emailAddress, isTesting);
            if (respondent == null)
            {
                respondent = new Respondent
                {
                    Credential = CredentialGenerator.Create(),
                    SurveyId = surveyId,
                    EmailAddress = emailAddress,
                    NumberSent = 0,
                    LastTimeSent = null,
                    CurrentPageId = null
                };
                _respondentSurveyExecutionRepository.Add(respondent, isTesting);
            }
            return respondent;
        }
        private void HandleSendEmail(Survey survey, string subject, string content, Respondent respondent, bool isTesting)
        {
            var surveyLink = _urlService.GetSurveyLink(survey.Id, isTesting, respondent);
            _requestInitializer.Initialize(survey, respondent);
            content = ReplaceSurveyLink(content, surveyLink);
            content = EvaluateString(content);

            if (!string.IsNullOrWhiteSpace(respondent.EmailAddress) && !string.IsNullOrEmpty(respondent.EmailAddress)) {
                EmailService.SendMail(respondent.EmailAddress, subject, content);
            }

            UpdateSentNumber(respondent, isTesting);
        }

        private string ReplaceSurveyLink(string content, string surveyLink)
        {
            return content.IndexOf("{{surveyLink}}", StringComparison.Ordinal) > -1 ?
                content.Replace("{{surveyLink}}", surveyLink) :
                $"<html><head><title>Survey Invitation</title></head><body>{content}{BuildSurveyButton(surveyLink)}</body></html>";
        }

        private string BuildSurveyButton(string externalParam)
        {
            return
                $"<br/><br/><a style='color:#fff;background-color:#337ab7;font-size: 18px;text-decoration: none;border:1px solid transparent;border-radius:4px;padding: 6px 12px;' href='{externalParam}'> Begin Survey </a>";
        }

        private string EvaluateString(string value)
        {
            try
            {
                value = _scriptExecutor.EvaluateString(value);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
            return value;
        }

        private void UpdateSentNumber(Respondent respondent, bool isTesting)
        {
            respondent.NumberSent = respondent.NumberSent + 1;
            respondent.LastTimeSent = DateTime.Now;
            _respondentRepository.Update(respondent, isTesting);
        }



    }
}
