using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Exceptions;
using LearningPlatform.Domain.ReportDesign.ReportEditedLabel;
using LearningPlatform.Domain.Reporting.Respondents;
using LearningPlatform.Domain.SurveyDesign;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Domain.ReportDesign
{

    public class ReportDefinitionService
    {
        private readonly IReportDefinitionRepository _reportDefinitionRepository;
        private readonly IReportPageDefinitionRepository _reportPageDefinitionRepository;
        private readonly IReportElementDefinitionRepository _reportElementDefinitionRepository;
        private readonly ReportEditedLabelDefinitionService _reportEditedLabelDefinitionService;

        public ReportDefinitionService(IReportDefinitionRepository reportDefinitionRepository,
            IReportPageDefinitionRepository reportPageDefinitionRepository,
            IReportElementDefinitionRepository reportElementDefinitionRepository,
            ReportEditedLabelDefinitionService reportEditedLabelDefinitionService)
        {
            _reportPageDefinitionRepository = reportPageDefinitionRepository;
            _reportDefinitionRepository = reportDefinitionRepository;
            _reportElementDefinitionRepository = reportElementDefinitionRepository;
            _reportEditedLabelDefinitionService = reportEditedLabelDefinitionService;
        }

        public ReportDefinition CreateDeaultSystemReport(string surveyId, string userId, IUnitOfWork unitOfWork)
        {
            var currentDateTime = DateTime.Now;
            var report = AddReportDefinition(new ReportDefinition
            {
                Name = "System Report " + currentDateTime.Ticks,
                SurveyId = surveyId,
                UserId = userId,
                Type = ReportType.System,
                Created = currentDateTime,
                Modified = currentDateTime
            });
            unitOfWork.SavePoint();

            AddDefaultPage(report);

            return report;
        }

        public ReportDefinition AddReportDefinition(ReportDefinition submittedReportDefinition)
        {
            ValidateDuplicateName(submittedReportDefinition, submittedReportDefinition.UserId);

            var newReport = new ReportDefinition(submittedReportDefinition.Name,
                submittedReportDefinition.SurveyId, submittedReportDefinition.UserId, submittedReportDefinition.Type);
            _reportDefinitionRepository.Add(newReport);

            return newReport;
        }

        public ReportPageDefinition AddDefaultPage(ReportDefinition reportDefinition)
        {
            var defaultPage = new ReportPageDefinition
            {
                ReportId = reportDefinition.Id,
                Position = 1
            };
            return AddReportPageDefinition(defaultPage);
        }

        public void UpdateReportDefinition(ReportDefinition reportDefinition)
        {
            _reportDefinitionRepository.Update(reportDefinition);
        }

        public ReportPageDefinition AddReportPageDefinition(ReportPageDefinition reportPageDefinition)
        {
            _reportPageDefinitionRepository.Add(reportPageDefinition);
            return reportPageDefinition;
        }

        public void DeleteReportPageDefinition(long reportPageDefinitionId)
        {
            _reportPageDefinitionRepository.Delete(reportPageDefinitionId);
        }

        public void DeleteReportElementDefinition(long reportElementDefinitionId)
        {
            _reportElementDefinitionRepository.Delete(reportElementDefinitionId);
            _reportEditedLabelDefinitionService.DeleteByReportElementId(reportElementDefinitionId);
        }

        public ReportDefinition GetReportById(long reportId)
        {
            var report = _reportDefinitionRepository.GetById(reportId);
            if (report == null) throw new EntityNotFoundException($"Report with id = {reportId} not found");
            return report;
        }

        public ReportDefinition GetSystemReport(string surveyId, string userId)
        {
            return _reportDefinitionRepository.GetSystemReport(surveyId, userId);
        }

        public ICollection<ReportPageDefinition> GetPagesByReportId(long reportId)
        {
            var pages = _reportPageDefinitionRepository.GetByReportId(reportId);
            foreach (var page in pages)
            {
                page.ReportElementDefinitions = page.ReportElementDefinitions.OrderBy(q => q.Position.Z).ToList();
            }
            return pages;
        }
        public ReportPageDefinition GetReportPageById(long pageId)
        {
            return _reportPageDefinitionRepository.GetById(pageId);
        }

        public ReportChartType GetChartTypeDefault(int questionType)
        {
            QuestionType questionTypeEnum = (QuestionType)Enum.ToObject(typeof(QuestionType), questionType);

            var questionTypesForBarChart = new[]
            {
                QuestionType.NetPromoterScoreQuestionDefinition, QuestionType.ScaleQuestionDefinition,
                QuestionType.RatingQuestionDefinition, QuestionType.MultipleSelectionQuestionDefinition
            };

            if (QuestionType.SingleSelectionQuestionDefinition == questionTypeEnum)
            {
                return ReportChartType.Pie;
            }
            if (questionTypesForBarChart.Contains(questionTypeEnum))
            {
                return ReportChartType.Bar;
            }
            if (QuestionType.SingleSelectionGridQuestionDefinition == questionTypeEnum ||
                QuestionType.ScaleGridQuestionDefinition == questionTypeEnum ||
                QuestionType.RatingGridQuestionDefinition == questionTypeEnum)
            {
                return ReportChartType.Area;
            }
            if (QuestionType.MultipleSelectionGridQuestionDefinition == questionTypeEnum)
            {
                return ReportChartType.Line;
            }
            return ReportChartType.Unknown;
        }

        public List<ReportDefinition> GetReports(string userId, ReportType type)
        {
            return _reportDefinitionRepository.GetReports(userId, type).ToList();
        }

        public bool UpdatePosition(MoveReportPage moveReport)
        {
            var pages = _reportPageDefinitionRepository.GetByReportId(moveReport.ReportId).ToList();
            if (pages.Count == 0) return false;

            if (moveReport.OldIndexPosition > moveReport.NewIndexPosition)
            {
                for (int i = moveReport.OldIndexPosition; i >= moveReport.NewIndexPosition; i--)
                {
                    pages[i].Position = (pages[i].Id == moveReport.PageId) ? moveReport.NewIndexPosition + 1 : pages[i].Position + 1;
                    _reportPageDefinitionRepository.Update(pages[i]);
                }
            }
            else
            {
                for (int i = moveReport.NewIndexPosition; i >= moveReport.OldIndexPosition; i--)
                {
                    pages[i].Position = (pages[i].Id == moveReport.PageId) ? moveReport.NewIndexPosition + 1 : pages[i].Position - 1;
                    _reportPageDefinitionRepository.Update(pages[i]);
                }
            }
            return true;
        }

        public void ValidateDuplicateName(ReportDefinition reportDefinition, string userId)
        {
            var reports = GetReports(userId, ReportType.User);
            if (reports.Any(report => string.Equals(reportDefinition.Name, report.Name, StringComparison.CurrentCultureIgnoreCase) && reportDefinition.Id != report.Id))
            {
                throw new InvalidDataException("Duplicate report name.");
            }
        }

    }
}