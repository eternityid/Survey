using System;
using System.Linq;
using LearningPlatform.Domain.ReportDesign.ReportEditedLabel;
using LearningPlatform.Domain.ReportDesign.ReportElements;

namespace LearningPlatform.Domain.ReportDesign
{
    public class ReportElementDefinitionService
    {
        private readonly IReportElementDefinitionRepository _reportElementDefinitionRepository;
        private readonly IReportPageDefinitionRepository _reportPageDefinitionRepository;
        private readonly ReportEditedLabelDefinitionService _reportEditedLabelDefinitionService;

        public ReportElementDefinitionService(IReportElementDefinitionRepository reportElementDefinitionRepository, IReportPageDefinitionRepository reportPageDefinitionRepository, ReportEditedLabelDefinitionService reportEditedLabelDefinitionService)
        {
            _reportElementDefinitionRepository = reportElementDefinitionRepository;
            _reportPageDefinitionRepository = reportPageDefinitionRepository;
            _reportEditedLabelDefinitionService = reportEditedLabelDefinitionService;
        }

        public IQueryable<ReportElementDefinition> GetReportElementsByReportId(long reportId)
        {
            return _reportElementDefinitionRepository.GetElementsByReportId(reportId);
        }

        public ReportElementDefinition AddReportElementDefinition(ReportElementDefinition submittedElementDefinition)
        {
            submittedElementDefinition.Position = new ElementPosition
            {
                X = 0,
                Y = 0,
                Z = (int)_reportPageDefinitionRepository.GetMaxzIndex(submittedElementDefinition.ReportPageDefinitionId) + 1
            };
            submittedElementDefinition.Size = submittedElementDefinition.Size ?? new ElementSize();
            _reportElementDefinitionRepository.Add(submittedElementDefinition);

            return submittedElementDefinition;
        }

        public ReportElementDefinition UpdateReportElementDefinition(ReportElementDefinition submittedElementDefinition)
        {
            var element = GetReportElementDefinition(submittedElementDefinition.Id);

            if (element is ReportChartElement)
            {
                var reportChartElement = element as ReportChartElement;
                reportChartElement.ChartType = ((ReportChartElement)submittedElementDefinition).ChartType;
                var questionAlias = ((ReportChartElement)submittedElementDefinition).QuestionAlias;
                if (reportChartElement.QuestionAlias != questionAlias)
                {
                    reportChartElement.QuestionAlias = questionAlias;
                    _reportEditedLabelDefinitionService.DeleteByReportElementId(submittedElementDefinition.Id);
                }
            }
            else if (element is ReportTableElement)
            {
                var reportTableElement = element as ReportTableElement;
                reportTableElement.QuestionAlias = ((ReportTableElement)submittedElementDefinition).QuestionAlias;
                _reportEditedLabelDefinitionService.DeleteByReportElementId(submittedElementDefinition.Id);
            }
            else if (element is ReportTextElement)
            {
                var reportTextElement = element as ReportTextElement;
                reportTextElement.Text = ((ReportTextElement)submittedElementDefinition).Text;
            }
            _reportElementDefinitionRepository.Update(element);

            return element;
        }

        public ReportElementDefinition UpdateReportElementDefinitionPosition(long elementId, int positionX, int positionY, int? positionZ = null)
        {
            var element = GetReportElementDefinition(elementId);
            element.Position.X = positionX;
            element.Position.Y = positionY;
            if (positionZ.HasValue)
                element.Position.Z = positionZ.Value;
            _reportElementDefinitionRepository.Update(element);

            return element;
        }

        public ReportElementDefinition UpdateReportElementDefinitionPositionAndSize(long elementId, ElementPosition position, ElementSize size)
        {
            var element = UpdateReportElementDefinitionPosition(elementId, position.X, position.Y, position.Z);
            element.Size = size;
            _reportElementDefinitionRepository.Update(element);

            return element;
        }

        public ReportElementDefinition GetReportElementDefinition(long reportElementId)
        {
            var element = _reportElementDefinitionRepository.GetById(reportElementId);
            if (element == null) throw new Exception("Cannot find report element");
            return element;
        }

    }
}
