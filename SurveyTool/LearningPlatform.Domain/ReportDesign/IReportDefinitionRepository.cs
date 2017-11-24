using System.Collections.Generic;
using System.Linq;
namespace LearningPlatform.Domain.ReportDesign
{
    public interface IReportDefinitionRepository
    {
        void Add(ReportDefinition reportDefinition);
        void Update(ReportDefinition reportDefinition);
        void Delete(long reportDefinitionId);
        ReportDefinition GetById(long reportDefinitionId);
        ReportDefinition GetSystemReport(string surveyId, string userId);
        IQueryable<ReportDefinition> GetReports(string userId, ReportType type);
        List<ReportDefinition> Search(string name, string userId, ReportType type, int start, int limit);
        int Count(string name, string userId, ReportType type);
    }
}
