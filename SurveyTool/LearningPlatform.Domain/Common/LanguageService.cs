using Autofac;
using LearningPlatform.Domain.SurveyDesign.LanguageStrings;
using LearningPlatform.Domain.SurveyExecution;
using LearningPlatform.Domain.SurveyExecution.Options;
using LearningPlatform.Domain.SurveyExecution.Request;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace LearningPlatform.Domain.Common
{
    public class LanguageService
    {
        private readonly IRequestContext _requestContext;
        private readonly IComponentContext _componentContext;

        public LanguageService(IRequestContext requestContext, IComponentContext componentContext)
        {
            _requestContext = requestContext;
            _componentContext = componentContext;
        }

        public string GetString(ILanguageString langString, string language)
        {
            ILanguageStringItem item = langString.GetItem(language);
            if(item==null)
            {
                var defaultSurveyLanguage = _requestContext.Survey.SurveySettings.DefaultLanguage;
                item = langString.GetItem(defaultSurveyLanguage) ?? langString.FirstItem();
            }
            return item?.Text;
        }

        public void SetString(ILanguageString langString, string language, string value)
        {
            var item = langString.GetItem(language);
            if (item == null)
            {
                langString.AddItem(new LanguageStringItem { Language = language, Text = value });
            }
            else
            {
                item.Text = value;
            }
        }

        public string GetRespondentLanguage()
        {
            var respondent = _requestContext.Respondent;
            var surveySettings = _requestContext.Survey.SurveySettings;
            if (respondent == null || respondent.Language == null)
            {
                foreach (var userLang in _requestContext.UserLanguages)
                {
                    if (surveySettings.Languages.Contains(userLang))
                    {
                        return userLang;
                    }
                }
                return surveySettings.DefaultLanguage;
            }

            return GetNormalizedRespondentLanguage(respondent, surveySettings);
        }

        private string GetNormalizedRespondentLanguage(Respondents.Respondent respondent, SurveyDesign.SurveySettings surveySettings)
        {
            if (surveySettings!=null && !surveySettings.Languages.Contains(respondent.Language))
            {
                var respondentLanguage = respondent.Language;
                while (!string.IsNullOrEmpty(respondentLanguage))
                {
                    if (surveySettings.Languages.Contains(respondentLanguage))
                    {
                        return respondentLanguage;
                    }
                    var culture = CultureInfo.GetCultureInfo(respondentLanguage);
                    respondentLanguage = culture.Parent.Name;
                }
            }
            return respondent.Language;
        }

        public string[] GetExpandedUserLanguages(string[] userLanguages)
        {
            var ret = new List<string>();
            if (userLanguages == null) return ret.ToArray();
            foreach(var lang in userLanguages)
            {
                try
                {
                    if (lang == null) continue;
                    var culture = new CultureInfo(RemoveQualifier(lang), true);
                    while(!string.IsNullOrEmpty(culture.Name))
                    {
                        if(!ret.Contains(culture.Name)) ret.Add(culture.Name);
                        culture = culture.Parent;
                    }
                }
                catch (CultureNotFoundException) {/* If we cannot create a culture, then ignore it.*/  }
            }
            return ret.ToArray();
        }

        private static string RemoveQualifier(string lang)
        {
            if (lang.Contains(";")) return lang.Substring(0, lang.IndexOf(';'));
            return lang;
        }

        public EvaluationString CreateEvaluationString(ILanguageString lang)
        {
            string language = _requestContext.Respondent == null ? GetRespondentLanguage() : _requestContext.Respondent.Language;
            var value = GetString(lang, language);
            return CreateEvaluationString(value);
        }

        public EvaluationString CreateEvaluationString(string value)
        {
            var ret = _componentContext.Resolve<EvaluationString>();
            ret.Value = value;
            return ret;
        }

        public List<Option> GetLanguageSelectionOptions()
        {
            return _requestContext.Survey.SurveySettings.Languages.Select(languageCode =>
                new Option
                {
                    Alias = languageCode,
                    TextEvaluationString = CreateEvaluationString(LanguageCodes.GetNativeLanguage(languageCode))
                }).ToList();
        }
    }
}