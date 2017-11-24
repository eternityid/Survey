using LearningPlatform.Application.ReportDesign.Models;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.ReportDesign;
using LearningPlatform.Domain.ReportDesign.ReportElements;
using LearningPlatform.Domain.Reporting.Respondents;
using LearningPlatform.Domain.Results;
using System;
using System.Linq;

namespace LearningPlatform.Application.ReportDesign
{
    public class ReportPageDefinitionAppService
    {
        private readonly ReportDefinitionService _reportDefinitionService;
        private readonly RespondentsReportingService _respondentsReportingService;
        private readonly ReportElementDefinitionService _reportElementDefinitionService;
        private readonly IUnitOfWorkFactory _unitOfWorkFactory;

        public ReportPageDefinitionAppService(RespondentsReportingService respondentsReportingService,
            ReportDefinitionService reportDefinitionService,
            ReportElementDefinitionService reportElementDefinitionService,
            IUnitOfWorkFactory unitOfWorkFactory)
        {
            _respondentsReportingService = respondentsReportingService;
            _reportDefinitionService = reportDefinitionService;
            _reportElementDefinitionService = reportElementDefinitionService;
            _unitOfWorkFactory = unitOfWorkFactory;
        }

        public void UpdateSettings(ReportPageSettingsViewModel pageSettingViewModel)
        {
            var reportPageDefinition = _reportDefinitionService.GetReportPageById(pageSettingViewModel.ReportPageId);
            if (reportPageDefinition == null)
            {
                throw new Exception($"Not found report page id: {pageSettingViewModel.ReportPageId}");
            }

            using (var unitOfWork = _unitOfWorkFactory.Create())
            {
                reportPageDefinition.IsDisplaySummaryTabular = pageSettingViewModel.DisplaySummaryTabular;
                unitOfWork.Commit();
            }
        }

        public void UpdateElementSettings(ReportElementSettingsViewModel reportElementSettings, string userId)
        {
            var reportPage = _reportDefinitionService.GetReportPageById(reportElementSettings.ReportPageId);
            if (reportPage == null)
            {
                throw new Exception($"Not found report page id: {reportElementSettings.ReportPageId}");
            }

            var resultElement = reportPage.GetReportElementDefinition(reportElementSettings.QuestionAlias) as ResultElement;
            using (var unitOfWork = _unitOfWorkFactory.Create())
            {
                if (resultElement == null)
                {
                    resultElement = new ResultElement(
                        reportPage.ReportId,
                        reportPage.Id,
                        reportElementSettings.QuestionAlias,
                        reportElementSettings.ChartType,
                        reportElementSettings.ColumnWidth);

                    _reportElementDefinitionService.AddReportElementDefinition(resultElement);
                }
                else
                {
                    resultElement.ChartType = reportElementSettings.ChartType;
                    resultElement.ColumnWidth = reportElementSettings.ColumnWidth;
                    _reportElementDefinitionService.UpdateReportElementDefinition(resultElement);
                }
                unitOfWork.Commit();
            }
        }
    }
}
