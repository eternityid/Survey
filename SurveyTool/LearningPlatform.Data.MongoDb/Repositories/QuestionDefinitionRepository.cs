using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Data.MongoDb.Repositories
{
    public class QuestionDefinitionRepository : RepositoryBase, IQuestionDefinitionRepository
    {
        public QuestionDefinitionRepository(IRequestObjectProvider<MongoDbContext> mongoDbContextProvider) : base(mongoDbContextProvider)
        {
        }

        private IMongoCollection<QuestionDefinition> QuestionCollection => DbContext.QuestionCollection;


        public QuestionDefinition Add(QuestionDefinition questionDefinition)
        {
            QuestionCollection.InsertOne(questionDefinition);
            return questionDefinition;
        }

        public void AddMany(IList<QuestionDefinition> questions)
        {
            if (questions != null && questions.Any())
            {
                QuestionCollection.InsertMany(questions);
            }
        }

        public List<QuestionDefinition> GetBySurveyId(string surveyId)
        {
            return QuestionCollection.FindSync(p => p.SurveyId == surveyId && p.LibraryId == null).ToList();
        }

        public List<QuestionDefinition> GetAllQuestionsInPage(string surveyId, string pageId)
        {
            throw new NotImplementedException();
        }

        public QuestionDefinition GetById(string questionId)
        {
            return QuestionCollection.FindSync(p => p.Id == questionId && p.LibraryId == null).FirstOrDefault();
        }

        public ICollection<QuestionAlias> GetQuestionAliases(string surveyId, string questionAlias)
        {
            var questions = QuestionCollection.FindSync(p => p.SurveyId == surveyId && p.Alias == questionAlias && p.LibraryId == null).ToList();

            return questions.Select(p => new QuestionAlias
            {
                Id = p.Id,
                Alias = p.Alias
            }).ToList();
        }

        public void Update(QuestionDefinition questionDefinition)
        {
            QuestionCollection.ReplaceOne(p => p.Id == questionDefinition.Id,
               questionDefinition, new UpdateOptions { IsUpsert = true });
        }

        public void Delete(string questionId)
        {
            QuestionCollection.DeleteOne(p => p.Id == questionId);
        }

        public List<QuestionDefinition> GetByIds(IList<string> questionIds)
        {
            return QuestionCollection.FindSync(p => questionIds.Contains(p.Id) && p.LibraryId == null).ToList();
        }

        public void DeleteMany(IList<QuestionDefinition> questions)
        {
            var questionIds = questions.Select(p => p.Id).ToList();
            QuestionCollection.DeleteMany(p => questionIds.Contains(p.Id) && p.LibraryId == null);
        }
    }
}
