using LearningPlatform.Application.ReportDesign.Models;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.ReportDesign;
using LearningPlatform.Domain.ReportDesign.Models;
using LearningPlatform.Domain.Reporting.Respondents;
using LearningPlatform.Domain.SurveyDesign.Questions.Services;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Application.ReportDesign
{
    public class RespondentsReportingAppService
    {
        private readonly RespondentsReportingService _respondentsReportingService;
        private readonly ReportDefinitionService _reportDefinitionService;
        private readonly ReadQuestionService _readQuestionService;
        private readonly IUnitOfWorkFactory _unitOfWorkFactory;

        public RespondentsReportingAppService(RespondentsReportingService respondentsReportingService,
            ReportDefinitionService reportDefinitionService,
            ReadQuestionService readQuestionService,
            IUnitOfWorkFactory unitOfWorkFactory)
        {
            _respondentsReportingService = respondentsReportingService;
            _reportDefinitionService = reportDefinitionService;
            _readQuestionService = readQuestionService;
            _unitOfWorkFactory = unitOfWorkFactory;
        }

        public AggregatedRespondents GetAggregatedRespondents(string surveyId, string userId, bool isTesting)
        {
            return _respondentsReportingService.GetAggregatedRespondents(surveyId, userId, isTesting);
        }

        public SurveyResultAggregatedRespondents GetSurveyResultAggregatedRespondents(string surveyId, string userId, bool isTesting)
        {
            var systemReport = _reportDefinitionService.GetSystemReport(surveyId, userId);
            if (systemReport == null)
            {
                using (var unitOfWork = _unitOfWorkFactory.Create())
                {
                    systemReport = _reportDefinitionService.CreateDeaultSystemReport(surveyId, userId, unitOfWork);
                    unitOfWork.Commit();
                }
            }

            var defaultSystemReportPage = _reportDefinitionService.GetPagesByReportId(systemReport.Id).First();
            var aggregatedRespondents = _respondentsReportingService.GetAggregatedRespondents(surveyId, userId, isTesting);

            var result = new SurveyResultAggregatedRespondents(aggregatedRespondents)
            {
                ReportPageId = defaultSystemReportPage.Id,
                IsDisplaySummaryTabular = defaultSystemReportPage.IsDisplaySummaryTabular
            };
            return result;
        }

        public List<ReportOpenTextViewModel> GetOpenTextRespondents(string surveyId, AggregatedRespondents aggregatedRespondents, bool isTesting)
        {
            var openEndedQuestions = _respondentsReportingService.GetOpenEndedQuestions(aggregatedRespondents.Questions);
            return openEndedQuestions?.Select(question =>
                    new ReportOpenTextViewModel
                    {
                        QuestionAlias = question.QuestionName,
                        Answers = _respondentsReportingService.GetOpenResponses(surveyId, question.QuestionName, -1, isTesting)
                    })
                .Where(x => x.Answers != null)
                .ToList();
        }

        public List<ReportPageQuestionModel> GetReportQuestions(long reportId, string userId, bool isTesting)
        {
            var report = _reportDefinitionService.GetReportById(reportId);
            var surveyId = report.SurveyId;
            var questionsDefinitions = _readQuestionService.GetReportQuestions(surveyId, isTesting);
            var aggregatedQuestions = _respondentsReportingService.GetAggregatedQuestions(surveyId, questionsDefinitions, userId, isTesting);

            return (from aggregatedQuestion in aggregatedQuestions
                join question in questionsDefinitions on aggregatedQuestion.QuestionName equals question.Alias
                select new ReportPageQuestionModel
                {
                    Id = question.Id,
                    Name = aggregatedQuestion.QuestionText,
                    Type = aggregatedQuestion.QuestionType,
                    QuestionAlias = aggregatedQuestion.QuestionName
                }).ToList();
        }

        public IList<string> GetOpenResponses(string surveyId, string questionKey, int limit, bool isTesting)
        {
            return _respondentsReportingService.GetOpenResponses(surveyId, questionKey, limit, isTesting);
        }
    }
}