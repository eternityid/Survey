using System.Linq;
using LearningPlatform.Domain.ReportDesign;
using LearningPlatform.Domain.ReportDesign.ReportElements;

namespace LearningPlatform.Data.MongoDb.Repositories
{
    internal class ReportElementDefinitionRepository : IReportElementDefinitionRepository
    {
        public void Add(ReportElementDefinition reportElementDefinition)
        {
            throw new System.NotImplementedException();
        }

        public void Update(ReportElementDefinition reportElementDefinition)
        {
            throw new System.NotImplementedException();
        }

        public void Delete(ReportElementDefinition reportElementDefinition)
        {
            throw new System.NotImplementedException();
        }

        public void Delete(long reportElementDefinitionId)
        {
            throw new System.NotImplementedException();
        }

        public ReportElementDefinition GetById(long reportElementDefinitionId)
        {
            throw new System.NotImplementedException();
        }

        public IQueryable<ReportElementDefinition> GetElementsByReportId(long reportId)
        {
            throw new System.NotImplementedException();
        }
    }
}
