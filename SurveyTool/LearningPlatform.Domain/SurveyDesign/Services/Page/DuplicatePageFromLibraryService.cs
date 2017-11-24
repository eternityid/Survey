using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Domain.SurveyDesign.Services.Page
{
    public class DuplicatePageFromLibraryService
    {
        private readonly INodeRepository _nodeRepository;
        private readonly IQuestionDefinitionRepository _questionDefinitionRepository;
        private readonly IOptionListRepository _optionListRepository;

        public DuplicatePageFromLibraryService(INodeRepository nodeRepository,
            IQuestionDefinitionRepository questionDefinitionRepository,
            IOptionListRepository optionListRepository)
        {
            _nodeRepository = nodeRepository;
            _questionDefinitionRepository = questionDefinitionRepository;
            _optionListRepository = optionListRepository;
        }

        public IList<PageDefinition> DuplicatePages(Folder folder, IList<PageDefinition> sourcePages, int duplicatePoint)
        {
            var sourceQuestionIds = new List<string>();
            foreach (var page in sourcePages)
            {
                BuildPage(page, folder.SurveyId);
                sourceQuestionIds.AddRange(page.QuestionIds);
            }

            var sourceOptionListIds = new List<string>();
            var sourceQuestionMap = new Dictionary<string, QuestionDefinition>();
            var sourceQuestions = _questionDefinitionRepository.GetByIds(sourceQuestionIds);
            AssignNewQuestionAliases(sourceQuestions, folder.SurveyId);
            foreach (var question in sourceQuestions)
            {
                sourceQuestionMap[question.Id] = question;
                BuildQuestion(question, folder.SurveyId);

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
                BuildOptionList(optionList, folder.SurveyId);
            }

            BuildPages(sourcePages, sourceQuestionMap, sourceOptionListMap);

            _optionListRepository.AddMany(sourceOptionLists);
            _questionDefinitionRepository.AddMany(sourceQuestions);
            _nodeRepository.AddMany(sourcePages.Select(page => page as Node).ToList());

            folder.ChildIds.InsertRange(duplicatePoint, sourcePages.Select(p => p.Id));
            folder.Version = Guid.NewGuid().ToString();
            _nodeRepository.Update(folder);

            return sourcePages;
        }

        private void AssignNewQuestionAliases(List<QuestionDefinition> newQuestions, string surveyId)
        {
            var existingQuestions = _questionDefinitionRepository.GetBySurveyId(surveyId);
            var existingQuestionAliases = existingQuestions.Select(p => p.Alias).ToList();

            var questionCounter = 1;
            foreach (var question in newQuestions)
            {
                while (existingQuestionAliases.Contains(question.Alias))
                {
                    question.Alias = $"q{questionCounter}";
                    questionCounter++;
                }
                existingQuestionAliases.Add(question.Alias);
            }
        }

        private void BuildPage(PageDefinition page, string surveyId)
        {
            page.Id = ObjectId.GenerateNewId().ToString();
            page.SurveyId = surveyId;
            page.LibraryId = null;
            page.Alias = $"Page_{DateTime.Now.Ticks}";
            page.Version = Guid.NewGuid().ToString();
            page.SkipCommands.Clear();
        }

        private void BuildQuestion(QuestionDefinition question, string surveyId)
        {
            question.Id = ObjectId.GenerateNewId().ToString();
            question.SurveyId = surveyId;
            question.LibraryId = null;
            question.Version = Guid.NewGuid().ToString();
        }

        private void BuildOptionList(OptionList optionList, string surveyId)
        {
            optionList.Id = ObjectId.GenerateNewId().ToString();
            optionList.SurveyId = surveyId;
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

        private void BuildPages(IList<PageDefinition> pages, Dictionary<string, QuestionDefinition> questionMap, Dictionary<string, OptionList> optionListMap)
        {
            foreach (var page in pages)
            {
                page.QuestionDefinitions = new List<QuestionDefinition>();
                var pageQuestionIds = new List<string>();
                foreach (var questionId in page.QuestionIds)
                {
                    var question = questionMap[questionId];

                    var questionWithOptions = question as QuestionWithOptionsDefinition;
                    if (questionWithOptions != null)
                    {
                        questionWithOptions.OptionList = optionListMap[questionWithOptions.OptionListId];
                        questionWithOptions.OptionListId = questionWithOptions.OptionList.Id;
                    }

                    var gridQuestion = question as GridQuestionDefinition;
                    var subQuestionWithOptions = gridQuestion?.SubQuestionDefinition as QuestionWithOptionsDefinition;
                    if (subQuestionWithOptions != null)
                    {
                        subQuestionWithOptions.OptionList = optionListMap[subQuestionWithOptions.OptionListId];
                        subQuestionWithOptions.OptionListId = subQuestionWithOptions.OptionList.Id;
                    }

                    page.QuestionDefinitions.Add(question);
                    pageQuestionIds.Add(question.Id);
                }
                page.QuestionIds = pageQuestionIds;
            }
        }
    }
}

