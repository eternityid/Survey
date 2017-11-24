using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyDesign.Services.Question
{
    public class QuestionWithOptionsService
    {
        private readonly IOptionListRepository _optionListRepository;

        public QuestionWithOptionsService(IOptionListRepository optionListRepository)
        {
            _optionListRepository = optionListRepository;
        }

        public Dictionary<string, OptionList> GetOptionListMap(IList<QuestionDefinition> questions)
        {
            var optionListIds = new List<string>();

            foreach (var question in questions)
            {
                var questionWithOptions = question as QuestionWithOptionsDefinition;
                if (questionWithOptions != null) optionListIds.Add(questionWithOptions.OptionListId);

                var gridQuestion = question as GridQuestionDefinition;
                var subQuestionWithOptions = gridQuestion?.SubQuestionDefinition as QuestionWithOptionsDefinition;
                if (subQuestionWithOptions != null) optionListIds.Add(subQuestionWithOptions.OptionListId);
            }

            var optionListMap = new Dictionary<string, OptionList>();
            var optionLists = _optionListRepository.GetByIds(optionListIds);
            foreach (var optionList in optionLists)
            {
                optionListMap[optionList.Id] = optionList;
            }

            return optionListMap;
        }
    }
}

