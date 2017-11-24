using System.Collections.Generic;
using Autofac;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using LearningPlatform.Domain.SurveyExecution.Engine;
using LearningPlatform.Domain.SurveyExecution.Questions;

namespace LearningPlatform.Domain.SurveyExecution.Scripting
{
    public class LoopHostObject
    {
        private readonly string _alias;
        private readonly IComponentContext _componentContext;

        public LoopHostObject(string alias, IComponentContext componentContext)
        {
            _alias = alias;
            _componentContext = componentContext;
        }

        private LoopService LoopService
        {
            get { return _componentContext.Resolve<LoopService>(); }
        }

        private QuestionAnswerService QuestionAnswerService
        {
            get { return _componentContext.Resolve<QuestionAnswerService>(); }
        }

        public string alias
        {
            get { return _alias; }
        }

        public IList<string> optionsShown
        {
            get { return QuestionAnswerService.GetOptionsShown(GetLoopDefinition()); }
        }

        public IList<string> optionsShownAsText
        {
            get { return QuestionAnswerService.GetOptionsShownAsText(GetLoopDefinition()); }
        }

        public IList<string> optionsNotShown
        {
            get { return QuestionAnswerService.GetOptionsNotShown(GetLoopDefinition()); }
        }

        public IList<string> optionsNotShownAsText
        {
            get { return QuestionAnswerService.GetOptionsNotShownAsText(GetLoopDefinition()); }
        }

        public IList<string> options
        {
            get { return QuestionAnswerService.GetAllOptions(GetLoopDefinition()); }
        }

        public IList<string> optionsAsText
        {
            get { return QuestionAnswerService.GetAllOptionsAsText(GetLoopDefinition()); }
        }

        private IHasOptions GetLoopDefinition()
        {
            return LoopService.GetFolderWithLoop(_alias).Loop;
        }


        public string current
        {
            get { return LoopService.GetLoopOption(_alias).Alias; }
        }

        public string currentAsText
        {
            get { return LoopService.GetLoopOption(_alias).Text; }
        }


        public override string ToString()
        {
            return currentAsText;
        }
    }
}