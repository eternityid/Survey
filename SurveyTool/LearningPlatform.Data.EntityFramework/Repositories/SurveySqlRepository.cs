using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Surveys;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace LearningPlatform.Data.EntityFramework.Repositories
{
    internal class SurveySqlRepository : ISurveyRepository
    {
        private readonly GenericRepository<Survey> _genericRepository;

        public SurveySqlRepository(GenericRepository<Survey> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        private SurveysDb.SurveysContext Context => _genericRepository.Context;

        public void Add(Survey survey)
        {
            _genericRepository.Add(survey);
        }
        public void Update(Survey survey)
        {
            _genericRepository.Update(survey);
        }

        public void Delete(Survey survey)
        {
            throw new NotImplementedException();
        }

        public Survey UpdateModifiedDate(string surveyId)
        {
            var survey = GetWithoutAllIncludings(surveyId);
            survey.Modified = DateTime.Now;
            _genericRepository.Update(survey);
            return survey;
        }

        public Survey UpdateLastPublished(string surveyId)
        {
            var survey = GetById(surveyId);
            survey.LastPublished = DateTime.Now;
            _genericRepository.Update(survey);
            return survey;
        }

        public Survey GetById(string surveyId)
        {
            Context.Folder
                 .Include(p => p.ChildNodes)
                 .Include(p=>p.Loop)
                 .Where(p => p.SurveyId == surveyId).Load();

            Context.Conditions
                .Include(p => p.ChildNodes)
                .Include(p => p.TrueFolder)
                .Include(p => p.FalseFolder)
                .Where(p => p.SurveyId == surveyId).Load();

            Context.PageDefinitions
                .Include(p => p.Title.Items)
                .Include(p => p.Description.Items)
                .Include(p => p.PageThemeOverrides)
                .Include(p => p.SkipCommands.Select(s => s.Expression.ExpressionItems))
                .Include(p => p.ChildNodes)
                .Where(p => p.SurveyId == surveyId).Load();
            // TODO: remove duplicate
            var optionLists = Context.OptionLists
                .Include(p => p.Options.Select(l => l.Text.Items))
                .Include(p=> p.OptionGroups.Select(l=>l.Heading.Items))
                .Where(p => p.SurveyId == surveyId)
                .ToList();

            foreach (var optionList in optionLists)
            {
                optionList.Options = optionList.Options.OrderBy(c => c.Position).ToList();
                optionList.OptionGroups = optionList.OptionGroups.OrderBy(g => g.Position).ToList();
            }
            Context.QuestionDefinitions
                .Include(p => p.Title.Items)
                .Include(p => p.Description.Items)
                .Include(p => p.Validations)
                .Include(p => p.QuestionMaskExpression)
                .Include(p => p.QuestionMaskExpression.ExpressionItems)
                .Where(p => p.SurveyId == surveyId)
                .OrderBy(p => p.PageDefinitionId).ThenBy(p => p.Position)
                .Load();

            SortByPositionForQuestionExpressionItems();

            Context.SingleSelectionQuestionDefinitions
                .Include(p => p.LikertLeftText.Items)
                .Include(p => p.LikertCenterText.Items)
                .Include(p => p.LikertRightText.Items)
                .Where(p => p.SurveyId == surveyId)
                .Load();

            Survey survey = Context.Surveys
                .Include(p => p.TopFolder.ChildNodes)
                .Include(p => p.TopFolder.Loop)
                .Include(p => p.SurveySettings.NextButtonText.Items)
                .Include(p => p.SurveySettings.PreviousButtonText.Items)
                .Include(p => p.SurveySettings.FinishButtonText.Items)
                .FirstOrDefault(p => p.Id == surveyId);

            if (survey != null)
            {
                survey.TopFolder.ChildNodes = survey.TopFolder.ChildNodes.OrderBy(n => n.Position).ToList();
                survey.SharedOptionLists =
                    Context.OptionLists.Where(p => p.SurveyId == surveyId && p.Name != null).ToList();

                SortByPositionForSkipExpressionItems(survey.TopFolder.ChildNodes);
            }
            return survey;
        }

        private void SortByPositionForQuestionExpressionItems()
        {
            foreach (var question in Context.QuestionDefinitions)
            {
                if (question.QuestionMaskExpression == null) continue;
                question.QuestionMaskExpression.ExpressionItems = question.QuestionMaskExpression.ExpressionItems.OrderBy(c => c.Position).ToList();
            }
        }

        private void SortByPositionForSkipExpressionItems(IList<Node> nodes)
        {
            if (nodes == null) return;
            foreach (var node in nodes)
            {
                var page = node as PageDefinition;
                if (page == null || page.SkipCommands == null) continue;
                foreach (var skipCommand in page.SkipCommands)
                {
                    if (skipCommand.Expression == null || skipCommand.Expression.ExpressionItems == null) continue;
                    skipCommand.Expression.ExpressionItems = skipCommand.Expression.ExpressionItems.OrderBy(c => c.Position).ToList();
                }
            }
        }

        public IList<Survey> GetSurveys(SurveySearchFilter surveySearchModel)
        {
            ComparisonOperator sentOperator;
            var query = String.IsNullOrEmpty(surveySearchModel.UserId)
                ? Context.Surveys.OrderByDescending(s => s.Id)
                : Context.Surveys.Where(s => s.SurveySettings.SurveyTitle.Contains(surveySearchModel.SearchString) && s.UserId == surveySearchModel.UserId);

            if (!String.IsNullOrWhiteSpace(surveySearchModel.SearchString))
            {
                query = query.Where(s => s.SurveySettings.SurveyTitle.Contains(surveySearchModel.SearchString));
            }
            if (!string.IsNullOrWhiteSpace(surveySearchModel.CreatedDateOperator))
            {
                Enum.TryParse(surveySearchModel.CreatedDateOperator, out sentOperator);
                DateTime CreatedDate = ConvertDate(surveySearchModel.CreatedDate);
                DateTime CreatedDateTo = ConvertDate(surveySearchModel.CreatedDateTo);

                switch (sentOperator)
                {
                    case ComparisonOperator.Equal:
                        query = query.Where(p => DbFunctions.TruncateTime(p.Created) == CreatedDate.Date);
                        break;
                    case ComparisonOperator.LessThan:
                        query = query.Where(p => DbFunctions.TruncateTime(p.Created) < CreatedDate.Date);
                        break;
                    case ComparisonOperator.GreaterThan:
                        query = query.Where(p => DbFunctions.TruncateTime(p.Created) > CreatedDate.Date);
                        break;
                    case ComparisonOperator.Between:
                        query = query.Where(p => DbFunctions.TruncateTime(p.Created) >= CreatedDate.Date && DbFunctions.TruncateTime(p.Created) <= CreatedDateTo.Date);
                        break;
                }
            }
            if (!string.IsNullOrWhiteSpace(surveySearchModel.ModifiedDateOperator))
            {
                Enum.TryParse(surveySearchModel.ModifiedDateOperator, out sentOperator);
                DateTime ModifiedDate = ConvertDate(surveySearchModel.ModifiedDate);
                DateTime ModifiedDateTo = ConvertDate(surveySearchModel.ModifiedDateTo);

                switch (sentOperator)
                {
                    case ComparisonOperator.Equal:
                        query = query.Where(p => DbFunctions.TruncateTime(p.Modified) == ModifiedDate.Date);
                        break;
                    case ComparisonOperator.LessThan:
                        query = query.Where(p => DbFunctions.TruncateTime(p.Modified) < ModifiedDate.Date);
                        break;
                    case ComparisonOperator.GreaterThan:
                        query = query.Where(p => DbFunctions.TruncateTime(p.Modified) > ModifiedDate.Date);
                        break;
                    case ComparisonOperator.Between:
                        query = query.Where(p => DbFunctions.TruncateTime(p.Modified) >= ModifiedDate.Date && DbFunctions.TruncateTime(p.Modified) <= ModifiedDateTo.Date);
                        break;
                }
            }
            var listOfStatus = new List<SurveyStatus>();
            if (surveySearchModel.Status.New)
            {
                listOfStatus.Add(SurveyStatus.New);
            }
            if (surveySearchModel.Status.Open)
            {
                listOfStatus.Add(SurveyStatus.Open);
            }
            if (surveySearchModel.Status.Closed)
            {
                listOfStatus.Add(SurveyStatus.Closed);
            }
            if (surveySearchModel.Status.TemprorarilyClosed)
            {
                listOfStatus.Add(SurveyStatus.TemprorarilyClosed);
            }
            query = surveySearchModel.ShowDeletedSurveys ?
                query.Where(t => listOfStatus.Contains(t.Status) || t.IsDeleted)
                : query.Where(t => listOfStatus.Contains(t.Status) && t.IsDeleted == false);
            return query.ToList();

        }

        public int Count(SurveySearchFilter surveySearchModel)
        {
            throw new NotImplementedException();
        }

        private DateTime ConvertDate(string value)
        {
            DateTime dateTimeResult;
            return DateTime.TryParse(value, out dateTimeResult) ? dateTimeResult : DateTime.MinValue;
        }
        public IEnumerable<Survey> GetByUserId(string userId)
        {
            return Context.Surveys
                .Where(s => s.UserId == userId)
                .OrderBy(s => s.SurveySettings.SurveyTitle);
        }

        public Survey GetWithoutAllIncludings(string surveyId)
        {
            return Context.Surveys.FirstOrDefault(s => s.Id == surveyId);
        }

        public bool Exists(string surveyId)
        {
            return Context.Surveys.Any(s=>s.Id == surveyId);
        }
    }
}