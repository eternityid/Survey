using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using MongoDB.Bson;
using System;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyDesign.Services.Page
{
    public class DuplicateLibraryPageService
    {
        private readonly ILibraryNodeRepository _libraryNodeRepository;
        private readonly IQuestionDefinitionRepository _questionDefinitionRepository;
        private readonly IOptionListRepository _optionListRepository;

        public DuplicateLibraryPageService(ILibraryNodeRepository libraryNodeRepository,
            IQuestionDefinitionRepository questionDefinitionRepository,
            IOptionListRepository optionListRepository)
        {
            _libraryNodeRepository = libraryNodeRepository;
            _questionDefinitionRepository = questionDefinitionRepository;
            _optionListRepository = optionListRepository;
        }

        public PageDefinition DuplicatePage(PageDefinition sourcePage)
        {
            var sourceQuestionIds = sourcePage.QuestionIds;
            var sourceOptionListIds = new List<string>();
            var sourceQuestionMap = new Dictionary<string, QuestionDefinition>();
            var sourceQuestions = _questionDefinitionRepository.GetByIds(sourceQuestionIds);

            foreach (var question in sourceQuestions)
            {
                sourceQuestionMap[question.Id] = question;
                BuildQuestion(question);

                var questionWithOptions = question as QuestionWithOptionsDefinition;
                if (questionWithOptions != null) sourceOptionListIds.Add(questionWithOptions.OptionListId);

                var gridQuestion = question as GridQuestionDefinition;
                var subQuestionWithOptions = gridQuestion?.SubQuestionDefinition as QuestionWithOptionsDefinition;
                if (subQuestionWithOptions != null) sourceOptionListIds.Add(subQuestionWithOptions.OptionListId);
            }

            var sourceOptionListMap = new Dictionary<string, OptionList>();
            var sourceOptionLists = _optionListRepository.GetByIds(sourceOptionListIds);
            foreach (var optionList in sourceOptionLists)
            {
                sourceOptionListMap[optionList.Id] = optionList;
                BuildOptionList(optionList);
            }

            BuildPage(sourcePage, sourceQuestionMap, sourceOptionListMap);

            _optionListRepository.AddMany(sourceOptionLists);
            _questionDefinitionRepository.AddMany(sourceQuestions);
            _libraryNodeRepository.Add(sourcePage);

            return sourcePage;
        }

        private void BuildPage(PageDefinition page)
        {
            page.Id = ObjectId.GenerateNewId().ToString();
            page.Alias = $"Page_{DateTime.Now.Ticks}";
            page.Version = Guid.NewGuid().ToString();
            page.SkipCommands.Clear();
        }

        private void BuildQuestion(QuestionDefinition question)
        {
            question.Id = ObjectId.GenerateNewId().ToString();
            question.LibraryId = null;
            question.Version = Guid.NewGuid().ToString();
        }

        private void BuildOptionList(OptionList optionList)
        {
            optionList.Id = ObjectId.GenerateNewId().ToString();
            foreach (var optionGroup in optionList.OptionGroups)
            {
                optionGroup.Id = ObjectId.GenerateNewId().ToString();
            }
            foreach (var option in optionList.Options)
            {
                option.Id = ObjectId.GenerateNewId().ToString();
                if (option.OtherQuestionDefinition == null) continue;
                option.OtherQuestionDefinition.Id = ObjectId.GenerateNewId().ToString();
                option.OtherQuestionDefinitionId = option.OtherQuestionDefinition.Id;
            }
        }

        private void BuildPage(PageDefinition page, Dictionary<string, QuestionDefinition> questionMap,
            Dictionary<string, OptionList> optionListMap)
        {
            BuildPage(page);

            page.QuestionDefinitions = new List<QuestionDefinition>();
            var pageQuestionIds = new List<string>();
            foreach (var questionId in page.QuestionIds)
            {
                var question = questionMap[questionId];
                var questionWithOptions = question as QuestionWithOptionsDefinition;

                if (questionWithOptions != null)
                {
                    var optionListId = questionWithOptions.OptionListId;
                    questionWithOptions.OptionList = optionListMap[optionListId];
                    questionWithOptions.OptionListId = questionWithOptions.OptionList.Id;

                    var gridQuestion = question as GridQuestionDefinition;
                    var subQuestionWithOptions = gridQuestion?.SubQuestionDefinition as QuestionWithOptionsDefinition;
                    if (subQuestionWithOptions != null)
                    {
                        subQuestionWithOptions.OptionList = optionListMap[optionListId];
                        subQuestionWithOptions.OptionListId = subQuestionWithOptions.OptionList.Id;
                    }
                }

                page.QuestionDefinitions.Add(question);
                pageQuestionIds.Add(question.Id);
            }
            page.QuestionIds = pageQuestionIds;
        }
    }
}

