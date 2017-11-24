using System;
using System.Security;
using LearningPlatform.Domain.Respondents;
using LearningPlatform.Domain.SurveyExecution.RepositoryContracts;
using LearningPlatform.Domain.SurveyExecution.Request;
using LearningPlatform.Domain.SurveyExecution.Security;

namespace LearningPlatform.Domain.SurveyExecution.Engine
{
    public class RespondentService
    {
        private readonly IRespondentSurveyExecutionRepository _respondentRepository;
        private readonly IRequestContext _requestContext;

        public RespondentService(IRespondentSurveyExecutionRepository respondentRepository, IRequestContext requestContext)
        {
            _respondentRepository = respondentRepository;
            _requestContext = requestContext;
        }

        public void UpdateRespondent(string responseStatus)
        {
            var respondent = _requestContext.Respondent;

            var requestState = _requestContext.State;
            respondent.CurrentPageId = requestState.PageId;
            respondent.CurrentLoopState = requestState.LoopState.ToString();
            respondent.CurrentGotoStack = requestState.GotoStack.ToString();
            respondent.CurrentSkipStack = requestState.SkipStack.ToString();
            if (responseStatus != null)
            {
                respondent.ResponseStatus = responseStatus;
            }
            UpdateRespondentTimestamp(respondent);
            _respondentRepository.Update(respondent, _requestContext.IsTesting);
        }

        private void UpdateRespondentTimestamp(Respondent respondent)
        {
            var currentTime = DateTime.Now;
            ResponseStatus currentRespondentStatus = (ResponseStatus)Enum.Parse(typeof(ResponseStatus), respondent.ResponseStatus);
            if (respondent.Started == null && currentRespondentStatus == ResponseStatus.InProgress)
            {
                respondent.Started = currentTime;
                respondent.LastModified = currentTime;
                return;
            }
            switch (currentRespondentStatus)
            {
                case ResponseStatus.InProgress:
                    respondent.LastModified = currentTime;
                    break;
                case ResponseStatus.Completed:
                    respondent.LastModified = currentTime;
                    respondent.Completed = currentTime;
                    break;
            }
        }

        public Respondent CreateNewRespondent(string surveyId, bool isTesting, string emailAddress, string externalId=null)
        {
            var respondent = new Respondent
            {
                Credential = CredentialGenerator.Create(),
                SurveyId = surveyId,
                EmailAddress = emailAddress,
                ExternalId = externalId,
                ResponseStatus = ResponseStatus.InProgress.ToString()
            };
            _respondentRepository.Add(respondent, isTesting);
            return respondent;
        }

        public Respondent GetExistingRespondent(string surveyId, bool isTesting, ProtectedVariables protectedVariables)
        {
            var respondent = _respondentRepository.Get(protectedVariables.RespondentId, surveyId, isTesting);
            if (respondent.Credential != protectedVariables.Credential)
            {
                throw new SecurityException("The credential was not correct");
            }

            if (respondent.ResponseStatusCode == ResponseStatus.NotTaken)
            {
                respondent.ResponseStatusCode = ResponseStatus.InProgress;
            }

            return respondent;
        }

        public Respondent GetExistingExternalRespondent(string externalId, string surveyId, bool isTesting)
        {
            var respondent = _respondentRepository.GetWithExternalId(externalId, surveyId, isTesting);
            if (respondent != null && respondent.ResponseStatusCode == ResponseStatus.NotTaken)
            {
                respondent.ResponseStatusCode = ResponseStatus.InProgress;
            }
            return respondent;
        }


    }
}