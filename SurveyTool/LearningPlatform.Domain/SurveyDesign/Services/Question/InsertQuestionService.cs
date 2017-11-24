using LearningPlatform.Domain.Exceptions;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Domain.SurveyDesign.Services.Question
{
    public class InsertQuestionService
    {
        private readonly IQuestionDefinitionRepository _questionDefinitionRepository;
        private readonly IOptionListRepository _optionListRepository;
        private readonly INodeRepository _nodeRepository;
        private readonly AliasQuestionService _aliasQuestionService;
        private readonly ValidateQuestionService _validateQuestionService;
        private readonly QuestionWithOptionsService _questionWithOptionsService;

        public InsertQuestionService(IQuestionDefinitionRepository questionDefinitionRepository,
            IOptionListRepository optionListRepository,
            AliasQuestionService aliasQuestionService,
            ValidateQuestionService validateQuestionService,
            INodeRepository nodeRepository,
            QuestionWithOptionsService questionWithOptionsService)
        {
            _questionDefinitionRepository = questionDefinitionRepository;
            _optionListRepository = optionListRepository;
            _aliasQuestionService = aliasQuestionService;
            _validateQuestionService = validateQuestionService;
            _nodeRepository = nodeRepository;
            _questionWithOptionsService = questionWithOptionsService;
        }

        public void Insert(PageDefinition page, QuestionDefinition question, int questionIndex)
        {
            _aliasQuestionService.EnsureQuestionAlias(question);

            var questionValidationResult = _validateQuestionService.Validate(question);
            if (!questionValidationResult.Valid)
            {
                throw new InvalidQuestionExeption(questionValidationResult.Message);
            }

            question.Id = ObjectId.GenerateNewId().ToString();
            question.SurveyId = page.SurveyId;
            question.Version = Guid.NewGuid().ToString();

            var optionLists = new List<OptionList>();
            var questionWithOptions = question as QuestionWithOptionsDefinition;
            if (questionWithOptions != null)
            {
                BuildOptionList(questionWithOptions);
                optionLists.Add(questionWithOptions.OptionList);
            }

            var gridQuestionDefinition = question as GridQuestionDefinition;
            var subQuestionWithOptions = gridQuestionDefinition?.SubQuestionDefinition as QuestionWithOptionsDefinition;
            if (subQuestionWithOptions != null)
            {
                BuildOptionList(subQuestionWithOptions);
                optionLists.Add(subQuestionWithOptions.OptionList);
            }

            if (optionLists.Any())
            {
                _optionListRepository.AddMany(optionLists);
            }

            _questionDefinitionRepository.Add(question);

            page.QuestionIds.Insert(questionIndex, question.Id);
            page.Version = Guid.NewGuid().ToString();

            _nodeRepository.Update(page);
        }

        public void InsertQuestionsFromLibrary(PageDefinition page, IList<QuestionDefinition> questions)
        {
            var existingQuestionsInSurvey = _questionDefinitionRepository.GetBySurveyId(page.SurveyId);
            var existingQuestionAliasesInSurvey = existingQuestionsInSurvey.Select(p => p.Alias).ToList();
            AssignNewQuestionAliases(existingQuestionAliasesInSurvey, questions);

            var optionListMap = _questionWithOptionsService.GetOptionListMap(questions);
            var optionLists = new List<OptionList>();

            foreach (var question in questions)
            {
                question.Id = ObjectId.GenerateNewId().ToString();
                question.SurveyId = page.SurveyId;
                question.LibraryId = null;
                question.Version = Guid.NewGuid().ToString();

                page.QuestionIds.Add(question.Id);

                var questionWithOptions = question as QuestionWithOptionsDefinition;
                if (questionWithOptions != null)
                {
                    questionWithOptions.OptionList = optionListMap[questionWithOptions.OptionListId];
                    BuildOptionList(questionWithOptions);
                    optionLists.Add(questionWithOptions.OptionList);
                }

                var gridQuestionDefinition = question as GridQuestionDefinition;
                var subQuestionWithOptions = gridQuestionDefinition?.SubQuestionDefinition as QuestionWithOptionsDefinition;
                if (subQuestionWithOptions != null)
                {
                    subQuestionWithOptions.SurveyId = page.SurveyId;
                    subQuestionWithOptions.LibraryId = null;
                    subQuestionWithOptions.OptionList = optionListMap[subQuestionWithOptions.OptionListId];
                    BuildOptionList(subQuestionWithOptions);
                    optionLists.Add(subQuestionWithOptions.OptionList);
                }
            }

            if (optionLists.Any())
            {
                _optionListRepository.AddMany(optionLists);
            }
            _questionDefinitionRepository.AddMany(questions);

            page.Version = Guid.NewGuid().ToString();
            _nodeRepository.Update(page);
        }

        private void AssignNewQuestionAliases(List<string> existingQuestionAliases, IList<QuestionDefinition> newQuestions)
        {
            var counter = 1;
            foreach (var question in newQuestions)
            {
                while (existingQuestionAliases.Contains(question.Alias))
                {
                    question.Alias = $"q{counter}";
                    counter++;
                }
                existingQuestionAliases.Add(question.Alias);
            }
        }

        private void BuildOptionList(QuestionWithOptionsDefinition question)
        {
            question.OptionList.Id = ObjectId.GenerateNewId().ToString();
            question.OptionList.SurveyId = question.SurveyId;
            question.OptionListId = question.OptionList.Id;

            foreach (var option in question.OptionList.Options)
            {
                option.Id = ObjectId.GenerateNewId().ToString();
                if (option.OtherQuestionDefinition != null)
                {
                    option.OtherQuestionDefinition.Id = ObjectId.GenerateNewId().ToString();
                    option.OtherQuestionDefinitionId = option.OtherQuestionDefinition.Id;
                }
            }
        }
    }
}