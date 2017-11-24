using Autofac;
using System;

namespace LearningPlatform.Domain.SurveyDesign.LanguageStrings
{
    public class LanguageStringFactory
    {
        private readonly IComponentContext _componentContext;

        public LanguageStringFactory(IComponentContext componentContext)
        {
            _componentContext = componentContext;
        }

        public LanguageString Create(Action<LanguageString> settings=null)
        {
            var languageString = _componentContext.Resolve<LanguageString>();
            settings?.Invoke(languageString);
            return languageString;
        }
    }
}