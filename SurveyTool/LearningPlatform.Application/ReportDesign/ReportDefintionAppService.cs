using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.ReportDesign;
using LearningPlatform.Domain.ReportDesign.Models;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Questions.Services;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Application.ReportDesign
{
    public class ReportDefinitionAppService
    {
        private readonly ReportDefinitionService _reportDefinitionService;
        private readonly ReadQuestionService _readQuestionService;
        private readonly IUnitOfWorkFactory _unitOfWorkFactory;

        public ReportDefinitionAppService(IUnitOfWorkFactory unitOfWorkFactory,
            ReportDefinitionService reportDefinitionService,
            ReadQuestionService readQuestionService)
        {
            _reportDefinitionService = reportDefinitionService;
            _readQuestionService = readQuestionService;
            _unitOfWorkFactory = unitOfWorkFactory;
        }


        public ReportDefinition GetReportById(long reportId)
        {
            return _reportDefinitionService.GetReportById(reportId);
        }

        public ReportDefinition CreateReport(ReportDefinition reportDefinition, string currentUserId)
        {
            using (var unitOfWork = _unitOfWorkFactory.Create())
            {
                reportDefinition.UserId = currentUserId;

                var newReport = _reportDefinitionService.AddReportDefinition(reportDefinition);
                unitOfWork.SavePoint();
                _reportDefinitionService.AddDefaultPage(newReport);
                unitOfWork.Commit();
                return newReport;
            }
        }

        public void UpdateReport(ReportDefinition reportDefinition, string currentUserId)
        {
            _reportDefinitionService.ValidateDuplicateName(reportDefinition, currentUserId);

            var currentReport = _reportDefinitionService.GetReportById(reportDefinition.Id);
            currentReport.Name = reportDefinition.Name;
            _reportDefinitionService.UpdateReportDefinition(currentReport);
        }


        public ICollection<ReportPageDefinition> GetPagesByReportId(long reportId)
        {
            return _reportDefinitionService.GetPagesByReportId(reportId);
        }

        public void AddReportPageDefinition(ReportPageDefinition reportPageDefinition)
        {
            using (var unitOfWork = _unitOfWorkFactory.Create())
            {
                _reportDefinitionService.AddReportPageDefinition(reportPageDefinition);
                unitOfWork.Commit();
            }
        }

        public void DeleteReportPageDefinition(long pageId)
        {
            _reportDefinitionService.DeleteReportPageDefinition(pageId);
        }

        public void UpdatePosition(MoveReportPage moveReportPage)
        {
            _reportDefinitionService.UpdatePosition(moveReportPage);
        }

        public List<ReportPageQuestionModel> GetReportQuestions(long reportId, bool isTesting)
        {
            var report = _reportDefinitionService.GetReportById(reportId);
            var questions = _readQuestionService.GetReportQuestions(report.SurveyId, isTesting);
            var listReportQuestions =
                questions.Select(
                    question =>
                        new ReportPageQuestionModel
                        {
                            Id = question.Id,
                            Name = question.Title.GetFirstItemText(),
                            QuestionAlias = question.Alias,
                            Type = (int)_readQuestionService.GetQuestionType(question),
                            Options = _readQuestionService.GetQuestionOptions(question),
                            Topics = _readQuestionService.GetQuestionTopics(question)
                        }).ToList();
            return listReportQuestions;
        }
    }
}