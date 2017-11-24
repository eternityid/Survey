using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Data.MongoDb.Repositories
{
    public class LibraryQuestionRepository : RepositoryBase, ILibraryQuestionRepository
    {
        public LibraryQuestionRepository(IRequestObjectProvider<MongoDbContext> mongoDbContextProvider) : base(mongoDbContextProvider)
        {
        }

        private IQueryable<QuestionDefinition> QueryableQuestions => DbContext.QuestionCollection.AsQueryable();

        public QuestionDefinition Add(QuestionDefinition question)
        {
            if (question.LibraryId == null) throw new InvalidOperationException();

            DbContext.QuestionCollection.InsertOne(question);
            return question;
        }

        public void Update(QuestionDefinition question)
        {
            if (question.LibraryId == null) throw new InvalidOperationException();

            DbContext.QuestionCollection.ReplaceOne(p => p.Id == question.Id && p.LibraryId == question.LibraryId,
               question, new UpdateOptions { IsUpsert = true });
        }

        public void Delete(QuestionDefinition question)
        {
            if (question.LibraryId == null) throw new InvalidOperationException();

            DbContext.QuestionCollection.DeleteOne(p => p.Id == question.Id && p.LibraryId == question.LibraryId);
        }

        public QuestionDefinition GetQuestion(string libraryId, string questionId)
        {
            if (libraryId == null) throw new ArgumentNullException(nameof(libraryId));
            return QueryableQuestions.FirstOrDefault(p => p.Id == questionId && p.LibraryId == libraryId);
        }

        public IList<QuestionDefinition> GetQuestionsByLibraryId(string libraryId)
        {
            if (libraryId == null) throw new ArgumentNullException(nameof(libraryId));

            return QueryableQuestions.Where(p => p.LibraryId == libraryId).OrderByDescending(p => p.Id).ToList();
        }

        public IList<QuestionDefinition> SearchByLibraryId(string libraryId, string term, int limit, int offset)
        {
            if (libraryId == null) throw new ArgumentNullException(nameof(libraryId));

            IQueryable<QuestionDefinition> temporaryQuery;
            if (string.IsNullOrWhiteSpace(term))
            {
                temporaryQuery = QueryableQuestions.Where(p => p.LibraryId == libraryId);
            }
            else
            {
                term = term.Trim().ToLower();
                temporaryQuery = QueryableQuestions.Where(p => p.LibraryId == libraryId && (
                    p.Title.Items.Any(x => x.Text.ToLower().Contains(term)) ||
                    p.Description.Items.Any(x => x.Text.ToLower().Contains(term)) ||
                    p.Alias.ToLower().Contains(term)));
            }

            temporaryQuery = temporaryQuery.OrderByDescending(p => p.Id);
            if (offset > 0) temporaryQuery = temporaryQuery.Skip(offset);
            if (limit > 0) temporaryQuery = temporaryQuery.Take(limit);

            return temporaryQuery.ToList();
        }

        public int CountByLibraryId(string libraryId, string query = null)
        {
            if (libraryId == null) throw new ArgumentNullException(nameof(libraryId));

            if (string.IsNullOrWhiteSpace(query)) return QueryableQuestions.Count(p => p.LibraryId == libraryId);

            query = query.Trim().ToLower();
            return QueryableQuestions.Count(p => p.LibraryId == libraryId && (
                    p.Title.Items.Any(x => x.Text.ToLower().Contains(query)) ||
                    p.Description.Items.Any(x => x.Text.ToLower().Contains(query)) ||
                    p.Alias.ToLower().Contains(query)));
        }

        public IList<QuestionDefinition> GetQuestions(string libraryId, IList<string> questionIds)
        {
            return QueryableQuestions.Where(p => p.LibraryId == libraryId && questionIds.Contains(p.Id)).ToList();
        }
    }
}