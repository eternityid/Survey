using LearningPlatform.Domain.Reporting;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyExecution.Security;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;

namespace LearningPlatform.Domain.Respondents
{
    public class RespondentService
    {
        private readonly IRespondentRepository _respondentRepository;
        private readonly RespondentUrlService _urlService;
        private readonly IElasticsearchReportingClient _elasticsearchReportingClient;

        public RespondentService(IRespondentRepository respondentRepository,
            RespondentUrlService urlService,
            IElasticsearchReportingClient elasticsearchReportingClient)
        {
            _respondentRepository = respondentRepository;
            _urlService = urlService;
            _elasticsearchReportingClient = elasticsearchReportingClient;
        }

        public RespondentDetail GetRespondentDetail(string surveyId, long respondentId, bool isTesting)
        {
            var respondent = _respondentRepository.Get(respondentId, surveyId, isTesting);
            if (respondent == null) return null;

            var respondentLink = _urlService.GetSurveyLink(surveyId, isTesting, respondent);

            var surveyIndexName = _elasticsearchReportingClient.GetSurveyIndex(surveyId, isTesting);
            var surveyTypeName = _elasticsearchReportingClient.GetDefaultTypeName();

            string respondentDetail = String.Empty;
            if (respondent.ResponseStatusCode != ResponseStatus.NotTaken)
            {
                var elasticsearchClient = _elasticsearchReportingClient.GetInstance();
                var answers = elasticsearchClient.Get<dynamic>(surveyIndexName, surveyTypeName, respondentId.ToString());
                if (answers.OriginalException != null)
                {
                    throw answers.OriginalException;
                }
                if (!answers.Success)
                {
                    throw new Exception(answers.HttpStatusCode.ToString());
                }
                respondentDetail = answers.Body["_source"].ToString();
            }

            return new RespondentDetail
            {
                Respondent = respondent,
                Link = respondentLink,
                Result = respondentDetail
            };
        }

        public void DeleteRespondents(string surveyId, IList<long> respondentIds, bool testMode)
        {
            if (respondentIds == null || respondentIds.Count <= 0) return;

            var surveyIndexName = _elasticsearchReportingClient.GetSurveyIndex(surveyId, testMode);
            var surveyTypeName = _elasticsearchReportingClient.GetDefaultTypeName();
            var elasticsearchClient = _elasticsearchReportingClient.GetInstance();

            foreach (var respondentId in respondentIds)
            {
                _respondentRepository.DeleteById(respondentId, testMode);
            }

            try
            {
                var queryPath = surveyIndexName + "/" + surveyTypeName + "/_delete_by_query";
                elasticsearchClient.DoRequest<dynamic>(Elasticsearch.Net.HttpMethod.POST, queryPath, GetDeleteRespondentsCondition(respondentIds));
            }
            catch (Exception error)
            {
                throw new Exception("Deleting responses was not successful", error);
            }
        }

        private string GetDeleteRespondentsCondition(IList<long> respondentIds)
        {
            var condition = new JObject(
                new JProperty("query", new JObject(
                    new JProperty("ids", new JObject(
                        new JProperty("values", new JArray(respondentIds)))))));

            return condition.ToString();
        }

        public void AddRespondents(string surveyId, IList<string> respondentEmails, bool isTesting)
        {
            foreach (var email in respondentEmails)
            {
                _respondentRepository.AddUsingMerge(new Respondent
                {
                    Language = "en",
                    Credential = CredentialGenerator.Create(),
                    SurveyId = surveyId,
                    EmailAddress = email,
                    NumberSent = 0,
                    LastTimeSent = null,
                    CurrentPageId = null
                }, isTesting);
            }
        }
    }
}