using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using LearningPlatform.Domain.ReportDesign;
using LearningPlatform.Domain.ReportDesign.ReportElements;

namespace LearningPlatform.Data.EntityFramework.Repositories
{
    internal class ReportPageDefinitionSqlRepository: IReportPageDefinitionRepository
    {
        private readonly GenericRepository<ReportPageDefinition> _genericRepository;
        private readonly IReportElementDefinitionRepository _reportElementRepository;

        public ReportPageDefinitionSqlRepository(GenericRepository<ReportPageDefinition> genericRepository, IReportElementDefinitionRepository reportElementRepository)
        {
            _genericRepository = genericRepository;
            _reportElementRepository = reportElementRepository;
        }

        private SurveysDb.SurveysContext Context { get { return _genericRepository.Context; } }

        public void Add(ReportPageDefinition reportPageDefinition)
        {
            _genericRepository.Add(reportPageDefinition);
        }

        public void Delete(long reportPageDefinitionId)
        {
            var page = GetById(reportPageDefinitionId);
            if (page != null && page.ReportElementDefinitions != null)
            {
                for (var i = page.ReportElementDefinitions.Count - 1; i >= 0; i--)
                {
                    _reportElementRepository.Delete(page.ReportElementDefinitions[i]);
                }
            }
            _genericRepository.Remove(page);
        }

        public void Update(ReportPageDefinition reportPageDefinition)
        {
            _genericRepository.Update(reportPageDefinition);
        }

        public ReportPageDefinition GetById(long reportPageDefinitionId)
        {
            var page = Context.ReportPageDefinitions
                .Include(p => p.ReportElementDefinitions)
                .FirstOrDefault(p => p.Id == reportPageDefinitionId);

            if (page == null) return null;

            IncludeReportElementHasQuestionToPage(page);

            return page;
        }

        public ICollection<ReportPageDefinition> GetByReportId(long reportId)
        {
            //TODO: Consider index use (and where clause)
            var pages = Context.ReportPageDefinitions
                .Include(p=>p.ReportElementDefinitions)
                .OrderBy(p=>p.Position)
                .Where(p => p.ReportId == reportId).ToList();

            foreach (var page in pages)
            {
                IncludeReportElementHasQuestionToPage(page);
            }

            return pages;
        }

        public long GetMaxzIndex(long reportPageId)
        {
            //TODO: Consider index use (and where clause)
            var reportQuestions = Context.ReportElementDefinitions.Where(p => p.ReportPageDefinitionId == reportPageId).ToList();
            return reportQuestions.Count > 0 ? reportQuestions.Max(p => p.Position.Z) : 0;
        }

        private void IncludeReportElementHasQuestionToPage(ReportPageDefinition page)
        {
            foreach (var reportElement in page.ReportElementDefinitions)
            {
                if (reportElement is ReportElementHasQuestion)
                {
                    Context.ReportElementHasQuestions
                        .Include(e => e.ReportEditedLabelDefinitions).SingleOrDefault(e => e.Id == reportElement.Id);
                }
            }
        }

    }
}
