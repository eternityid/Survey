using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Surveys;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Data.MongoDb.Repositories
{
    public class SurveyRepository : RepositoryBase, ISurveyRepository
    {

        public SurveyRepository(IRequestObjectProvider<MongoDbContext> mongoDbContextProvider) : base(mongoDbContextProvider)
        {
        }

        private IQueryable<Survey> QueryableSurveys => DbContext.SurveyCollection.AsQueryable();
        private IMongoCollection<Survey> SurveyCollection => DbContext.SurveyCollection;


        public Survey GetById(string surveyId)
        {
            return QueryableSurveys.FirstOrDefault(survey => survey.Id == surveyId && survey.LibraryId == null);
        }
        public IEnumerable<Survey> GetByUserId(string userId)
        {
            return QueryableSurveys.Where(survey =>
            (survey.UserId == userId || survey.AccessRights.Write.Contains(userId) || survey.AccessRights.Full.Contains(userId)) &&
            survey.IsDeleted == false &&
            survey.LibraryId == null).ToList();
        }

        public IList<Survey> GetSurveys(SurveySearchFilter surveySearchModel)
        {
            return GetSurveysQuery(surveySearchModel).OrderByDescending(survey => survey.Id)
                .Skip(surveySearchModel.Start)
                .Take(surveySearchModel.Limit).ToList();
        }

        private IQueryable<Survey> GetSurveysQuery(SurveySearchFilter searchModel)
        {
            return QueryableSurveys.Where(survey =>
            (survey.UserId == searchModel.UserId || survey.AccessRights.Write.Contains(searchModel.UserId) || survey.AccessRights.Full.Contains(searchModel.UserId)) &&
            survey.LibraryId == null)
                .SearchStringQuery(searchModel)
                .DateQuery(searchModel.CreatedDateOperator,
                    searchModel.CreatedDate,
                    searchModel.CreatedDateTo)
                .DateQuery(searchModel.ModifiedDateOperator,
                    searchModel.ModifiedDate,
                    searchModel.ModifiedDateTo)
                .StatusFilterQuery(searchModel);
        }

        public int Count(SurveySearchFilter surveySearchModel)
        {
            return GetSurveysQuery(surveySearchModel).Count();
        }

        public void Add(Survey survey)
        {
            if(survey.LibraryId != null) throw new InvalidOperationException();

            SurveyCollection.InsertOne(survey);
        }

        public void Update(Survey survey)
        {
            if (survey.LibraryId != null) throw new InvalidOperationException();

            SurveyCollection.ReplaceOne(p => p.Id == survey.Id, survey, new UpdateOptions { IsUpsert = true });
        }

        public void Delete(Survey survey)
        {
            if (survey.LibraryId != null) throw new InvalidOperationException();

            SurveyCollection.DeleteOne(p => p.Id == survey.Id);
        }

        public Survey UpdateModifiedDate(string surveyId)
        {
            var filter = Builders<Survey>.Filter.Where(p => p.Id == surveyId && p.LibraryId == null);
            var update = Builders<Survey>.Update
                .Set(p => p.Modified, DateTime.Now)
                .Set(p => p.Version, Guid.NewGuid().ToString());

            return SurveyCollection.FindOneAndUpdate(filter, update, new FindOneAndUpdateOptions<Survey, Survey>
            {
                ReturnDocument = ReturnDocument.After
            });
        }

        public Survey UpdateLastPublished(string surveyId)
        {
            var filter = Builders<Survey>.Filter.Where(p => p.Id == surveyId && p.LibraryId == null);
            var update = Builders<Survey>.Update.Set(p => p.LastPublished, DateTime.Now);
            return SurveyCollection.FindOneAndUpdate(filter, update);
        }

        public void AddPageDefinition(string surveyId, PageDefinition pageDefinition)
        {
            // This will not support adding pages to blocks. Here we would have to recursively scan the ChildNodes for the right block (folder).
            var update = UpdateDef.AddToSet(s => s.TopFolder.ChildNodes, pageDefinition);
            SurveyCollection.UpdateOne(FilterDef.Where(p => p.Id == surveyId && p.LibraryId == null), update);
        }

        private static UpdateDefinitionBuilder<Survey> UpdateDef => Builders<Survey>.Update;

        private static FilterDefinitionBuilder<Survey> FilterDef => Builders<Survey>.Filter;

        public bool Exists(string surveyId)
        {
            var survey = QueryableSurveys.FirstOrDefault(p => p.Id == surveyId && p.LibraryId == null);
            return survey != null;
        }
    }
}