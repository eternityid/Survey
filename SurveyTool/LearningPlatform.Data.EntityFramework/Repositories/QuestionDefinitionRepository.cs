using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace LearningPlatform.Data.EntityFramework.Repositories
{
    internal class QuestionDefinitionRepository : IQuestionDefinitionRepository
    {
        private readonly SurveysContextProvider _contextProvider;
        private readonly GenericRepository<QuestionDefinition> _genericRepository;

        public QuestionDefinitionRepository(SurveysContextProvider contextProvider, GenericRepository<QuestionDefinition> genericRepository)
        {
            _contextProvider = contextProvider;
            _genericRepository = genericRepository;
        }

        private SurveysDb.SurveysContext Context => _contextProvider.Get();

        public List<QuestionDefinition> GetBySurveyId(string surveyId)
        {
            var optionLists = Context.OptionLists
               .Include(p => p.Options.Select(l => l.Text.Items))
               .Include(p => p.OptionGroups.Select(l => l.Heading.Items))
               .Where(p => p.SurveyId == surveyId)
               .ToList();
            foreach (var optionList in optionLists)
            {
                optionList.Options = optionList.Options.OrderBy(c => c.Position).ToList();
            }

            Context.SingleSelectionQuestionDefinitions
                .Include(p => p.LikertLeftText.Items)
                .Include(p => p.LikertCenterText.Items)
                .Include(p => p.LikertRightText.Items)
                .Where(p => p.SurveyId == surveyId)
                .Load();

            var questions = Context.QuestionDefinitions
                .Include(p => p.Title.Items)
                .Include(p => p.Description.Items)
                .Include(p => p.Validations)
                .Include(q => q.QuestionMaskExpression)
                .Include(q => q.QuestionMaskExpression.ExpressionItems)
                .Where(p => p.SurveyId == surveyId)
                .OrderBy(p => p.Position)
                .ToList();

            return questions;
        }

        public List<QuestionDefinition> GetAllQuestionsInPage(string surveyId, string pageId)
        {
            LoadOptionLists(surveyId);

            Context.SingleSelectionQuestionDefinitions
                .Include(p => p.LikertLeftText.Items)
                .Include(p => p.LikertCenterText.Items)
                .Include(p => p.LikertRightText.Items)
                .Where(p => p.PageDefinitionId == pageId && p.SurveyId == surveyId)
                .Load();


            var questions = Context.QuestionDefinitions
                    .Include(p => p.Title.Items)
                    .Include(p => p.Description.Items)
                    .Include(p => p.Validations)
                    .Include(q => q.QuestionMaskExpression)
                    .Include(q => q.QuestionMaskExpression.ExpressionItems)
                    .Where(p => p.PageDefinitionId == pageId && p.SurveyId == surveyId)
                    .OrderBy(p => p.Position)
                    .ToList();
            return questions;
        }

        private void LoadOptionLists(string surveyId)
        {
            var optionLists = Context.OptionLists
               .Include(p => p.Options.Select(l => l.Text.Items))
               .Include(p => p.OptionGroups.Select(l=>l.Heading.Items))
               .Where(p => p.SurveyId == surveyId)
               .ToList();

            foreach (var optionList in optionLists)
            {
                optionList.Options = optionList.Options.OrderBy(c => c.Position).ToList();
            }
        }

        public QuestionDefinition Add(QuestionDefinition questionDefinition)
        {
            _genericRepository.Add(questionDefinition);
            return questionDefinition;
        }

        public void AddMany(IList<QuestionDefinition> question)
        {
            throw new NotImplementedException();
        }

        public void Update(QuestionDefinition questionDefinition)
        {
            _genericRepository.Update(questionDefinition);
        }

        public void Delete(string questionId)
        {
            _genericRepository.Remove(questionId);
        }

        public ICollection<QuestionAlias> GetQuestionAliases(string surveyId, string questionAlias)
        {
            return Context.QuestionDefinitions
                .Where(q => q.SurveyId == surveyId && q.Alias.Equals(questionAlias))
                .Select(q => new QuestionAlias
                {
                    Id = q.Id,
                    Alias = q.Alias
                })
                .ToList();
        }

        public List<QuestionDefinition> GetByIds(IList<string> questionIds)
        {
            throw new NotImplementedException();
        }

        public void DeleteMany(IList<QuestionDefinition> questions)
        {
            throw new NotImplementedException();
        }

        public QuestionDefinition GetById(string questionId)
        {
            throw new NotImplementedException();
        }
    }
}
