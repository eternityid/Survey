using System;
using System.Collections.Generic;
using Autofac;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyExecution.Questions;
using LearningPlatform.Domain.SurveyExecution.Request;

namespace LearningPlatform.Domain.SurveyExecution.Scripting
{
    public class QuestionHostObject
    {
        private readonly IComponentContext _componentContext;
        private readonly string _alias;

        public QuestionHostObject(string alias, IComponentContext componentContext)
        {
            _componentContext = componentContext;
            _alias = alias;
        }

        private IQuestionService QuestionService
        {
            get { return _componentContext.Resolve<IQuestionService>(); }
        }

        private QuestionAnswerService QuestionAnswerService
        {
            get { return _componentContext.Resolve<QuestionAnswerService>(); }
        }

        private IRequestContext RequestContext
        {
            get { return _componentContext.Resolve<IRequestContext>(); }
        }


        public string alias
        {
            get { return _alias; }
        }

        public string type
        {
            get { return QuestionService.GetQuestion(_alias).GetType().Name; }
        }

        public string title
        {
            get { return QuestionService.GetQuestion(_alias).Title; }
        }

        public string description
        {
            get { return QuestionService.GetQuestion(_alias).Description; }
        }

        public object answer
        {
            get { return QuestionAnswerService.GetAnswer(_alias); }
            set { SetAnswer(_alias, value); }
        }

        private void SetAnswer(string id, object answerObj)
        {
            Question question = QuestionService.GetQuestion(id);
            question.Answer = answerObj;
            QuestionService.SaveQuestion(question);
        }


        public object answerAsText
        {
            get { return QuestionAnswerService.GetAnswerAsText(_alias); }
        }

        public IList<string> optionsSelected
        {
            get { return QuestionAnswerService.GetOptionsSelected(GetQuestionDefinitionWithOptions()); }
        }

        public IList<string> optionsSelectedAsText
        {
            get { return QuestionAnswerService.GetOptionsSelectedAsText(GetQuestionDefinitionWithOptions()); }
        }

        public IList<string> optionsNotSelected
        {
            get { return QuestionAnswerService.GetOptionsNotSelected(GetQuestionDefinitionWithOptions()); }
        }

        public IList<string> optionsNotSelectedAsText
        {
            get { return QuestionAnswerService.GetOptionsNotSelectedAsText(GetQuestionDefinitionWithOptions()); }
        }

        public IList<string> optionsShown
        {
            get { return QuestionAnswerService.GetOptionsShown(GetQuestionDefinitionWithOptions()); }
        }

        public IList<string> optionsShownAsText
        {
            get { return QuestionAnswerService.GetOptionsShownAsText(GetQuestionDefinitionWithOptions()); }
        }

        public IList<string> optionsNotShown
        {
            get { return QuestionAnswerService.GetOptionsNotShown(GetQuestionDefinitionWithOptions()); }
        }

        public IList<string> optionsNotShownAsText
        {
            get { return QuestionAnswerService.GetOptionsNotShownAsText(GetQuestionDefinitionWithOptions()); }
        }

        public IList<string> options
        {
            get { return QuestionAnswerService.GetAllOptions(GetQuestionDefinitionWithOptions()); }
        }

        public IList<string> optionsAsText
        {
            get { return QuestionAnswerService.GetAllOptionsAsText(GetQuestionDefinitionWithOptions()); }
        }

        private QuestionWithOptionsDefinition GetQuestionDefinitionWithOptions()
        {
            return RequestContext.NodeService.GetQuestionDefinitionByAlias(_alias) as QuestionWithOptionsDefinition;
        }


        public override string ToString()
        {
            return ScriptExecutor.DisplayString(answerAsText);
        }
    }
}