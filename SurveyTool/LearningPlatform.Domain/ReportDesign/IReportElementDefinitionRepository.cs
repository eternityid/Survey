using System.Linq;

namespace LearningPlatform.Domain.ReportDesign
{
    public interface IReportElementDefinitionRepository
    {
        void Add(ReportElementDefinition reportElementDefinition);
        void Update(ReportElementDefinition reportElementDefinition);
        void Delete(ReportElementDefinition reportElementDefinition);
        void Delete(long reportElementDefinitionId);
        ReportElementDefinition GetById(long reportElementDefinitionId);
        IQueryable<ReportElementDefinition> GetElementsByReportId(long reportId);
    }
}
