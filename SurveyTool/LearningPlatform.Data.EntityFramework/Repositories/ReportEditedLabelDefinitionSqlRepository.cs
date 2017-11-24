using System.Linq;
using LearningPlatform.Domain.ReportDesign.ReportEditedLabel;

namespace LearningPlatform.Data.EntityFramework.Repositories
{
    internal class ReportEditedLabelDefinitionSqlRepository: IReportEditedLabelDefinitionRepository
    {
        private readonly GenericRepository<ReportEditedLabelDefinition> _genericRepository;

        public ReportEditedLabelDefinitionSqlRepository(GenericRepository<ReportEditedLabelDefinition> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        private SurveysDb.SurveysContext Context { get { return _genericRepository.Context; } }

        public void Add(ReportEditedLabelDefinition reportEditedLabelDefinition)
        {
            _genericRepository.Add(reportEditedLabelDefinition);
        }

        public void Delete(ReportEditedLabelDefinition reportEditedLabelDefinition)
        {
            _genericRepository.Remove(reportEditedLabelDefinition);
        }

        public void Delete(long reportEditedLabelDefinitionId)
        {
            _genericRepository.Remove(GetById(reportEditedLabelDefinitionId));
        }

        public void DeleteByReportElementId(long reportElementId)
        {
            //TODO: Consider index use (and where clause)
            var reportEditedLabels = from label in Context.ReportEditedLabelDefinitions
                where label.ReportElementHasQuestionId == reportElementId
                select label;
            Context.ReportEditedLabelDefinitions.RemoveRange(reportEditedLabels);
        }

        public void Update(ReportEditedLabelDefinition reportEditedLabelDefinition)
        {
            _genericRepository.Update(reportEditedLabelDefinition);
        }

        public ReportEditedLabelDefinition GetById(long reportEditedLabelDefinitionId)
        {
            return Context.ReportEditedLabelDefinitions.FirstOrDefault(p => p.Id == reportEditedLabelDefinitionId);
        }

        public IQueryable<ReportEditedLabelDefinition> GetEditedLabelsByReportElementId(long reportElementDefinitionId)
        {
            //TODO: Consider index use (and where clause)
            return Context.ReportEditedLabelDefinitions.Where(p => p.ReportElementHasQuestionId == reportElementDefinitionId);
        }
    }
}
