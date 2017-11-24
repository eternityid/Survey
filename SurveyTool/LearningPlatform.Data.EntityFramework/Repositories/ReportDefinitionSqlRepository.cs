using System;
using System.Collections.Generic;
using System.Linq;
using LearningPlatform.Domain.ReportDesign;

namespace LearningPlatform.Data.EntityFramework.Repositories
{
    internal class ReportDefinitionSqlRepository: IReportDefinitionRepository
    {
        private readonly GenericRepository<ReportDefinition> _genericRepository;

        public ReportDefinitionSqlRepository(GenericRepository<ReportDefinition> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        private SurveysDb.SurveysContext Context { get { return _genericRepository.Context; } }

        public void Add(ReportDefinition reportDefinition)
        {
            _genericRepository.Add(reportDefinition);
        }

        public void Delete(long reportDefinitionId)
        {
            _genericRepository.Remove(GetById(reportDefinitionId));
        }

        public void Update(ReportDefinition reportDefinition)
        {
            _genericRepository.Update(reportDefinition);
        }

        public ReportDefinition GetById(long reportDefinitionId)
        {
            return Context.ReportDefinitions.FirstOrDefault(p => p.Id == reportDefinitionId);
        }

        public ReportDefinition GetSystemReport(string surveyId, string userId)
        {
            //TODO: Consider index use (and where clause)
            return Context.ReportDefinitions
                 .FirstOrDefault(p => p.SurveyId == surveyId && p.UserId == userId && p.Type == ReportType.System);
        }

        public IQueryable<ReportDefinition> GetReports(string userId, ReportType type)
        {
            //TODO: Consider index use (and where clause)
            return Context.ReportDefinitions.Where(d => d.UserId == userId && d.Type == type);
        }

        public List<ReportDefinition> Search(string name, string userId, ReportType type, int start, int limit)
        {
            //TODO: Consider index use (and where clause)
            if (String.IsNullOrWhiteSpace(name))
            {
                return Context.ReportDefinitions
                .Where(r=> r.UserId == userId && r.Type == type)
                .OrderByDescending(r=>r.Created)
                .Skip(start).Take(limit).ToList();
            }
            return Context.ReportDefinitions
                .Where(r => r.Name.Contains(name) && r.UserId == userId && r.Type == type)
                .OrderByDescending(r => r.Created)
                .Skip(start).Take(limit).ToList();
        }

        public int Count(string name, string userId, ReportType type)
        {
            //TODO: Consider index use (and where clause)
            return String.IsNullOrWhiteSpace(name) ? Context.ReportDefinitions.Where(r => r.UserId == userId && r.Type == type).Count() : Context.ReportDefinitions.Where(r => r.Name.Contains(name) && r.UserId == userId && r.Type == type).Count();
        }
    }
}
