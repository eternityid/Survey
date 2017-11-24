using System.Linq;

namespace LearningPlatform.Domain.ReportDesign.ReportEditedLabel
{
    public interface IReportEditedLabelDefinitionRepository
    {
        void Add(ReportEditedLabelDefinition reportEditedLabelDefinition);
        void Update(ReportEditedLabelDefinition reportEditedLabelDefinition);
        void Delete(ReportEditedLabelDefinition reportEditedLabelDefinition);
        void Delete(long reportEditedLabelDefinitionId);
        void DeleteByReportElementId(long reportElementDefinitionId);
        ReportEditedLabelDefinition GetById(long reportEditedLabelDefinitionId);
        IQueryable<ReportEditedLabelDefinition> GetEditedLabelsByReportElementId(long reportElementDefinitionId);
    }
}
