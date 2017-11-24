using System;
using System.Collections.Generic;
using System.Linq;
using LearningPlatform.Domain.ReportDesign;

namespace LearningPlatform.Data.MongoDb.Repositories
{
    internal class ReportDefinitionRepository: IReportDefinitionRepository
    {
        public void Add(ReportDefinition reportDefinition)
        {
            throw new NotImplementedException();
        }

        public void Update(ReportDefinition reportDefinition)
        {
            throw new NotImplementedException();
        }

        public void Delete(long reportDefinitionId)
        {
            throw new NotImplementedException();
        }

        public ReportDefinition GetById(long reportDefinitionId)
        {
            throw new NotImplementedException();
        }

        public ReportDefinition GetSystemReport(string surveyId, string userId)
        {
            throw new NotImplementedException();
        }

        public IQueryable<ReportDefinition> GetReports(string userId, ReportType type)
        {
            throw new NotImplementedException();
        }

        public List<ReportDefinition> Search(string name, string userId, ReportType type, int start, int limit)
        {
            throw new NotImplementedException();
        }

        public int Count(string name, string userId, ReportType type)
        {
            throw new NotImplementedException();
        }
    }
}
