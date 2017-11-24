using System.Linq;
using LearningPlatform.Domain.ReportDesign.ReportEditedLabel;

namespace LearningPlatform.Data.MongoDb.Repositories
{
    internal class ReportEditedLabelDefinitionRepository: IReportEditedLabelDefinitionRepository
    {
        public void Add(ReportEditedLabelDefinition reportEditedLabelDefinition)
        {
            throw new System.NotImplementedException();
        }

        public void Update(ReportEditedLabelDefinition reportEditedLabelDefinition)
        {
            throw new System.NotImplementedException();
        }

        public void Delete(ReportEditedLabelDefinition reportEditedLabelDefinition)
        {
            throw new System.NotImplementedException();
        }

        public void Delete(long reportEditedLabelDefinitionId)
        {
            throw new System.NotImplementedException();
        }

        public void DeleteByReportElementId(long reportElementDefinitionId)
        {
            throw new System.NotImplementedException();
        }

        public ReportEditedLabelDefinition GetById(long reportEditedLabelDefinitionId)
        {
            throw new System.NotImplementedException();
        }

        public IQueryable<ReportEditedLabelDefinition> GetEditedLabelsByReportElementId(long reportElementDefinitionId)
        {
            throw new System.NotImplementedException();
        }
    }
}
