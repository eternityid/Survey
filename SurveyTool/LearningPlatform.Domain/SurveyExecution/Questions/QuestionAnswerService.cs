using System.Collections;
using System.Collections.Generic;
using System.Linq;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using LearningPlatform.Domain.SurveyExecution.Options;
using LearningPlatform.Domain.SurveyExecution.Request;
using LearningPlatform.Domain.SurveyExecution.Scripting;
using Microsoft.ClearScript;
using Option = LearningPlatform.Domain.SurveyExecution.Options.Option;

namespace LearningPlatform.Domain.SurveyExecution.Questions
{
    public class QuestionAnswerService
    {
        private readonly IQuestionService _questionService;
        private readonly IRequestContext _requestContext;
        private readonly OptionsService _optionsService;
        private readonly MapperService _mapper;

        public QuestionAnswerService(IQuestionService questionService, IRequestContext requestContext, OptionsService optionsService, MapperService mapper)
        {
            _questionService = questionService;
            _requestContext = requestContext;
            _optionsService = optionsService;
            _mapper = mapper;
        }

        public object GetAnswer(string questionAlias)
        {
            var question = GetQuestionByAlias(questionAlias);
            if (question == null) return "";

            object answer = question.Answer;
            var dictionary = answer as IDictionary;
            if (dictionary == null)
                return answer;
            return dictionary.ToPropertyBag();
        }

        private Question GetQuestionByAlias(string questionAlias)
        {
            Question question;
            try
            {
                question = _questionService.GetQuestion(questionAlias);
            }
            catch (KeyNotFoundException)
            {
                // Question does not exist.
                return null;
            }
            return question;
        }

        public object GetAnswerAsText(string questionAlias)
        {
            const string emptyAnswer = "";
            var question = GetQuestionByAlias(questionAlias);

            if (question == null) return emptyAnswer;

            var answer = GetAnswer(questionAlias);
            if(answer == null) return emptyAnswer;

            if (!(question is QuestionWithOptions)) return answer;

            var propertyBag = answer as PropertyBag;
            if (propertyBag != null)
            {
                return propertyBag.ToStringList().Select(alias => GetOptionText(alias)).ToList();
            }
            return GetOptionText(answer.ToString());
        }


        public IList<string> GetOptionsSelected(QuestionWithOptionsDefinition definition)
        {
            var o = GetAnswer(definition.Alias);
            var answerAsPropertyBag = o as PropertyBag;
            if (answerAsPropertyBag == null)
            {
                var answerAsString = o as string;
                if (answerAsString == null) return new List<string>();
                return new List<string> { answerAsString };
            }
            return answerAsPropertyBag.ToStringList();
        }

        public IList<string> GetOptionsSelectedAsText(QuestionWithOptionsDefinition definition)
        {
            return GetOptionsSelected(definition).Select(alias => GetOptionText(alias)).ToList();
        }

        public IList<string> GetAllOptions(IHasOptions definition)
        {
            if (definition == null) return new List<string>();
            return definition.GetOptions().Select(p => p.Alias).ToList();
        }

        public IList<string> GetAllOptionsAsText(IHasOptions definition)
        {
            return GetAllOptions(definition).Select(alias => GetOptionText(alias)).ToList();
        }

        public IList<string> GetOptionsShown(IHasOptions definition)
        {
            if (definition == null) return new List<string>();
            var options = _optionsService.GetMaskedOptions(definition);
            return options.Select(o => o.Alias).ToList();
        }


        public IList<string> GetOptionsShownAsText(IHasOptions definition)
        {
            return GetOptionsShown(definition).Select(alias => GetOptionText(alias)).ToList();
        }

        public IList<string> GetOptionsNotSelected(QuestionWithOptionsDefinition definition)
        {
            var shown = GetOptionsShown(definition);
            return shown.Except(GetOptionsSelected(definition)).ToList();
        }

        public IList<string> GetOptionsNotSelectedAsText(QuestionWithOptionsDefinition definition)
        {
            return GetOptionsNotSelected(definition).Select(alias => GetOptionText(alias)).ToList();
        }

        public IList<string> GetOptionsNotShown(IHasOptions definition)
        {
            var shown = GetOptionsShown(definition);
            return GetAllOptions(definition).Except(shown).ToList();
        }

        public IList<string> GetOptionsNotShownAsText(IHasOptions definition)
        {
            return GetOptionsNotShown(definition).Select(alias => GetOptionText(alias)).ToList();
        }

        public string GetOptionText(string alias)
        {
            return _mapper.Map<Option>(_requestContext.NodeService.GetOptionByAlias(alias)).Text;
        }
    }
}