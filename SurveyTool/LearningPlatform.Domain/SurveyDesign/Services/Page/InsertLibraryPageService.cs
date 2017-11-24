using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using MongoDB.Bson;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Domain.SurveyDesign.Services.Page
{
    public class InsertLibraryPageService
    {
        private readonly ILibraryNodeRepository _libraryNodeRepository;
        private readonly IQuestionDefinitionRepository _questionDefinitionRepository;
        private readonly IOptionListRepository _optionListRepository;

        public InsertLibraryPageService(ILibraryNodeRepository libraryNodeRepository,
            IQuestionDefinitionRepository questionDefinitionRepository,
            IOptionListRepository optionListRepository)
        {
            _libraryNodeRepository = libraryNodeRepository;
            _questionDefinitionRepository = questionDefinitionRepository;
            _optionListRepository = optionListRepository;
        }

        public PageDefinition Insert(PageDefinition sourcePage, string libraryId)
        {
            var newPage = sourcePage.DeepCopyByExpressionTree();
            newPage.Id = null;
            newPage.SurveyId = null;
            newPage.LibraryId = libraryId;
            newPage.SkipCommands.Clear();
            newPage.QuestionIds.Clear();
            newPage.PageLayoutId = null;
            newPage.PageThemeId = null;
            newPage.PageThemeOverrides = null;

            var optionLists = new List<OptionList>();
            foreach (var question in newPage.QuestionDefinitions)
            {
                question.Id = ObjectId.GenerateNewId().ToString();
                question.SurveyId = null;
                question.LibraryId = null;
                question.QuestionMask = null;
                question.QuestionMaskExpression = null;

                newPage.QuestionIds.Add(question.Id);

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
                    subQuestionWithOptions.SurveyId = null;
                    BuildOptionList(subQuestionWithOptions);
                    optionLists.Add(subQuestionWithOptions.OptionList);
                }
            }

            if (optionLists.Any()) _optionListRepository.AddMany(optionLists);
            if (newPage.QuestionDefinitions.Any()) _questionDefinitionRepository.AddMany(newPage.QuestionDefinitions);
            _libraryNodeRepository.Add(newPage);

            return newPage;
        }

        private void BuildOptionList(QuestionWithOptionsDefinition question)
        {
            question.OptionList.Id = ObjectId.GenerateNewId().ToString();
            question.OptionListId = question.OptionList.Id;
            question.OptionsMask = new OptionsMask();

            question.OptionList.Options.RemoveAll(p => p.OptionsMask?.QuestionId != null);
            question.OptionList.SurveyId = null;

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

