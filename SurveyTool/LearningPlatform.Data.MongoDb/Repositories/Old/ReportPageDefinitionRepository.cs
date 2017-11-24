using System.Collections.Generic;
using LearningPlatform.Domain.ReportDesign;
using LearningPlatform.Domain.ReportDesign.ReportElements;

namespace LearningPlatform.Data.MongoDb.Repositories
{
    internal class ReportPageDefinitionRepository: IReportPageDefinitionRepository
    {
        public void Add(ReportPageDefinition reportPageDefinition)
        {
            throw new System.NotImplementedException();
        }

        public void Update(ReportPageDefinition reportPageDefinition)
        {
            throw new System.NotImplementedException();
        }

        public void Delete(long reportPageDefinitionId)
        {
            throw new System.NotImplementedException();
        }

        public ReportPageDefinition GetById(long reportPageDefinitionId)
        {
            throw new System.NotImplementedException();
        }

        public ICollection<ReportPageDefinition> GetByReportId(long reportId)
        {
            throw new System.NotImplementedException();
        }

        public long GetMaxzIndex(long reportPageId)
        {
            throw new System.NotImplementedException();
        }
    }
}
