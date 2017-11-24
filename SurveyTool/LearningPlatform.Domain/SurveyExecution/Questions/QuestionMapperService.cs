using System.Collections.Generic;
using Autofac;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Resources;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyExecution.Options;
using LearningPlatform.Domain.SurveyExecution.Validators;

namespace LearningPlatform.Domain.SurveyExecution.Questions
{
    public class QuestionMapperService
    {
        private readonly OptionsService _optionsService;
        private readonly IComponentContext _componentContext;
        private readonly MapperService _mapper;
        private readonly LanguageService _languageService;
        public QuestionMapperService(OptionsService optionsService, IComponentContext componentContext, MapperService mapper, LanguageService languageService)
        {
            _optionsService = optionsService;
            _componentContext = componentContext;
            _mapper = mapper;
            _languageService = languageService;
        }

        public void MapQuestion(QuestionWithOptions question, QuestionWithOptionsDefinition definition)
        {
            question.Options = _optionsService.GetMaskedOptions(definition);
            if (definition.ContainsExclusiveOption && question is MultipleSelectionQuestion)
            {
                question.Validators.Add(new ExclusiveValidator(_componentContext.Resolve<IResourceManager>()));
            }
        }

        public void MapGridQuestion(GridQuestion gridQuestion, GridQuestionDefinition definition)
        {
            MapQuestion(gridQuestion, definition);
            gridQuestion.Questions = new List<Question>();
            foreach (var option in gridQuestion.Options)
            {
                var childQuestion = _mapper.Map<Question>(definition.SubQuestionDefinition);
                childQuestion.Alias = definition.Alias;
                childQuestion.ListItemAlias = option.Alias;
                if (definition is ShortTextListQuestionDefinition || definition is LongTextListQuestionDefinition)
                {
                    childQuestion.TitleEvaluationString =
                        _languageService.CreateEvaluationString(gridQuestion.Title + " - " + option.Text);
                }
                gridQuestion.Questions.Add(childQuestion);
            }
        }

        public void MapLanguageSelectionQuestion(LanguageSelectionQuestion question, LanguageSelectionQuestionDefinition definition)
        {
            question.Options = _languageService.GetLanguageSelectionOptions();
        }
    }
}