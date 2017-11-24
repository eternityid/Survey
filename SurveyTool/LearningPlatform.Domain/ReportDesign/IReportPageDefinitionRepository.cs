using System.Collections.Generic;

namespace LearningPlatform.Domain.ReportDesign
{
    public interface IReportPageDefinitionRepository
    {
        void Add(ReportPageDefinition reportPageDefinition);
        void Update(ReportPageDefinition reportPageDefinition);
        void Delete(long reportPageDefinitionId);
        ReportPageDefinition GetById(long reportPageDefinitionId);
        ICollection<ReportPageDefinition> GetByReportId(long reportId);
        long GetMaxzIndex(long reportPageId);
    }
}
