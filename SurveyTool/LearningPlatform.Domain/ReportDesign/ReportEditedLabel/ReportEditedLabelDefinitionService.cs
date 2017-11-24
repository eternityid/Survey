using System.Linq;

namespace LearningPlatform.Domain.ReportDesign.ReportEditedLabel
{
    public class ReportEditedLabelDefinitionService
    {
        private readonly IReportEditedLabelDefinitionRepository _reportEditedLabelDefinitionRepository;

        public ReportEditedLabelDefinitionService(IReportEditedLabelDefinitionRepository reportEditedLabelDefinitionRepository)
        {
            _reportEditedLabelDefinitionRepository = reportEditedLabelDefinitionRepository;
        }

        public void Add(ReportEditedLabelDefinition reportEditedLabelDefinition)
        {
            _reportEditedLabelDefinitionRepository.Add(reportEditedLabelDefinition);
        }

        public void Update(ReportEditedLabelDefinition reportEditedLabelDefinition)
        {
            _reportEditedLabelDefinitionRepository.Update(reportEditedLabelDefinition);
        }

        public void Delete(long reportEditedLabelId)
        {
            _reportEditedLabelDefinitionRepository.Delete(reportEditedLabelId);
        }

        public void DeleteByReportElementId(long reportElementId)
        {
            _reportEditedLabelDefinitionRepository.DeleteByReportElementId(reportElementId);
        }

        public IQueryable<ReportEditedLabelDefinition> GetEditedLabelsByReportElementId(long reportElementId)
        {
            return _reportEditedLabelDefinitionRepository.GetEditedLabelsByReportElementId(reportElementId);
        }

        public ReportEditedLabelDefinition GetById(long reportEditedLabelId)
        {
            return _reportEditedLabelDefinitionRepository.GetById(reportEditedLabelId);
        }
    }
}
