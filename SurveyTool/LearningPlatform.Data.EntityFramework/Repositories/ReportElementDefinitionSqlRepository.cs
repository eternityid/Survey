using System.Data.Entity;
using System.Linq;
using LearningPlatform.Domain.ReportDesign;
using LearningPlatform.Domain.ReportDesign.ReportElements;

namespace LearningPlatform.Data.EntityFramework.Repositories
{
    internal class ReportElementDefinitionSqlRepository : IReportElementDefinitionRepository
    {
        private readonly GenericRepository<ReportElementDefinition> _genericRepository;
        private readonly SurveysContextProvider _contextProvider;

        public ReportElementDefinitionSqlRepository(GenericRepository<ReportElementDefinition> genericRepository, SurveysContextProvider contextProvider)
        {
            _genericRepository = genericRepository;
            _contextProvider = contextProvider;
        }

        private SurveysDb.SurveysContext Context { get { return _contextProvider.Get(); } }

        public void Add(ReportElementDefinition reportElementDefinition)
        {
            _genericRepository.Add(reportElementDefinition);
        }

        public void Delete(ReportElementDefinition reportElementDefinition)
        {
            _genericRepository.Remove(reportElementDefinition);
        }

        public void Delete(long reportElementDefinitionId)
        {
            _genericRepository.Remove(GetById(reportElementDefinitionId));
        }

        public void Update(ReportElementDefinition reportElementDefinition)
        {
            _genericRepository.Update(reportElementDefinition);
        }

        public ReportElementDefinition GetById(long reportElementDefinitionId)
        {
            var reportElementDefinition = Context.ReportElementDefinitions.FirstOrDefault(p => p.Id == reportElementDefinitionId);
            IncludeLabelsToReportElement(reportElementDefinition);

            return reportElementDefinition;
        }

        public IQueryable<ReportElementDefinition> GetElementsByReportId(long reportId)
        {
            //TODO: Consider index use (and where clause)
            var reportElementDefinitions = Context.ReportElementDefinitions.Where(p => p.ReportId == reportId);

            foreach (var reportElement in reportElementDefinitions)
            {
                IncludeLabelsToReportElement(reportElement);
            }

            return reportElementDefinitions;
        }

        private void IncludeLabelsToReportElement(ReportElementDefinition reportElement)
        {
            //TODO: Consider index use (and where clause)
            if (reportElement is ReportElementHasQuestion)
            {
                Context.ReportElementHasQuestions.Include(e=>e.ReportEditedLabelDefinitions)
                    .SingleOrDefault(e => e.Id == reportElement.Id);
            }
        }
    }
}
