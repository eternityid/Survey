using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using LearningPlatform.Domain.Reporting.Respondents;
using LearningPlatform.Domain.SurveyDesign.Questions.Services;

namespace LearningPlatform.Domain.SurveyDesign.Questions.Options
{
    public class OptionGroupService
    {
        private readonly IOptionListRepository _optionGroupRepository;
        private readonly LanguageService _languageService;
        private readonly ReadQuestionService _readQuestionService;
        private readonly PictureQuestionService _pictureQuestionService;

        public OptionGroupService(IOptionListRepository optionGroupRepository,
            LanguageService languageService, ReadQuestionService readQuestionService, PictureQuestionService pictureQuestionService)
        {
            _optionGroupRepository = optionGroupRepository;
            _languageService = languageService;
            _readQuestionService = readQuestionService;
            _pictureQuestionService = pictureQuestionService;
        }

        public void UpdateOptionGroups(QuestionDefinition question, OptionList updatingOptionList)
        {
            QuestionType questionType = _readQuestionService.GetQuestionType(question);
            if (questionType != QuestionType.SingleSelectionQuestionDefinition && questionType != QuestionType.MultipleSelectionQuestionDefinition) return;
            if (_pictureQuestionService.IsPictureSelection(question)) return;

            var questionWithOptions = question as QuestionWithOptionsDefinition;
            IList<string> updatingOptionGroupIds = updatingOptionList.OptionGroups.Select(p => p.Id).ToList();

            Debug.Assert(questionWithOptions != null, "questionWithOptions != null");
            foreach (var oldOptionGroup in questionWithOptions.OptionList.OptionGroups.ToList())
            {
                if (updatingOptionGroupIds.IndexOf(oldOptionGroup.Id) < 0)
                {
                    DeleteOptionGroup(oldOptionGroup);
                    questionWithOptions.OptionList.OptionGroups.Remove(oldOptionGroup);
                }
                else
                {
                    UpdateOptionGroup(oldOptionGroup,
                        updatingOptionList.OptionGroups.First(p => p.Id == oldOptionGroup.Id));
                }
            }

            IList<string> exitingOptionGroupIds =
                questionWithOptions.OptionList.OptionGroups.Select(p => p.Id).ToList();
            foreach (var newOptionGroup in updatingOptionList.OptionGroups)
            {
                if (exitingOptionGroupIds.IndexOf(newOptionGroup.Id) < 0)
                {
                    questionWithOptions.OptionList.OptionGroups.Add(newOptionGroup);
                }
            }
        }

        private void DeleteOptionGroup(OptionGroup optionGroup)
        {
            _optionGroupRepository.DeleteOptionGroup(optionGroup.ListId, optionGroup.Id);
        }

        private void UpdateOptionGroup(OptionGroup oldOptionGroup, OptionGroup newOptionGroup)
        {
            oldOptionGroup.Alias = newOptionGroup.Alias;
            oldOptionGroup.OrderType = newOptionGroup.OrderType;
            oldOptionGroup.HideHeading = newOptionGroup.HideHeading;
            oldOptionGroup.Position = newOptionGroup.Position;
            var text = newOptionGroup.Heading.Items.First();
            _languageService.SetString(oldOptionGroup.Heading, text.Language, text.Text);
        }
    }
}
