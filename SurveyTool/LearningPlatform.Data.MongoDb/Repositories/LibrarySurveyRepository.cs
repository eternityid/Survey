using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Data.MongoDb.Repositories
{
    public class LibrarySurveyRepository : RepositoryBase, ILibrarySurveyRepository
    {
        public LibrarySurveyRepository(IRequestObjectProvider<MongoDbContext> mongoDbContextProvider) : base(mongoDbContextProvider)
        {
        }

        private IQueryable<Survey> QueryableSurveys => DbContext.SurveyCollection.AsQueryable();

        public void Add(Survey survey)
        {
            if (survey.LibraryId == null) throw new InvalidOperationException();
            DbContext.SurveyCollection.InsertOne(survey);
        }

        public void Update(Survey survey)
        {
            if (survey.LibraryId == null) throw new InvalidOperationException();
            DbContext.SurveyCollection.ReplaceOne(p => p.Id == survey.Id && p.LibraryId == survey.LibraryId, survey, new UpdateOptions { IsUpsert = true });
        }

        public void Delete(Survey survey)
        {
            if (survey.LibraryId == null) throw new InvalidOperationException();
            DbContext.SurveyCollection.DeleteOne(p => p.Id == survey.Id && p.LibraryId == survey.LibraryId);
        }

        public Survey GetSurvey(string libraryId, string surveyId)
        {
            if (libraryId == null) throw new ArgumentNullException(nameof(libraryId));
            return QueryableSurveys.FirstOrDefault(p => p.Id == surveyId && p.LibraryId == libraryId);
        }

        public IList<Survey> GetSurveysByLibraryId(string libraryId)
        {
            if(libraryId == null) throw new ArgumentNullException(nameof(libraryId));
            return DbContext.SurveyCollection.Find(p => p.LibraryId == libraryId).ToList();
        }

        public IList<Survey> SearchByLibraryId(string libraryId, string query, int limit, int offset)
        {
            if (libraryId == null) throw new ArgumentNullException(nameof(libraryId));

            IQueryable<Survey> temporaryQuery;
            if (string.IsNullOrWhiteSpace(query))
            {
                temporaryQuery = QueryableSurveys.Where(p => p.LibraryId == libraryId);
            }
            else
            {
                query = query.Trim().ToLower();
                temporaryQuery = QueryableSurveys.Where(p => p.LibraryId == libraryId && p.SurveySettings.SurveyTitle.ToLower().Contains(query));
            }
            temporaryQuery = temporaryQuery.OrderByDescending(p => p.Modified);
            if (offset > 0) temporaryQuery = temporaryQuery.Skip(offset);
            if (limit > 0) temporaryQuery = temporaryQuery.Take(limit);

            return temporaryQuery.ToList();
        }

        public int CountByLibraryId(string libraryId, string query = null)
        {
            if (libraryId == null) throw new ArgumentNullException(nameof(libraryId));

            if (string.IsNullOrWhiteSpace(query)) return QueryableSurveys.Count(p => p.LibraryId == libraryId);

            query = query.Trim().ToLower();
            return QueryableSurveys.Count(p => p.LibraryId == libraryId && p.SurveySettings.SurveyTitle.ToLower().Contains(query));
        }
    }
}