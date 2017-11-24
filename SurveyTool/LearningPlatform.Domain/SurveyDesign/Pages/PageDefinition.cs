using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.FlowLogic;
using LearningPlatform.Domain.SurveyDesign.LanguageStrings;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyThemes;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Domain.SurveyDesign.Pages
{
    public class PageDefinition : Node
    {
        public PageDefinition()
        {
            QuestionDefinitions = new List<QuestionDefinition>();
            QuestionIds = new List<string>();
            SkipCommands = new List<SkipCommand>();
        }

        public PageDefinition(params QuestionDefinition[] questionDefinitions) : this()
        {
            if (questionDefinitions != null)
            {
                foreach (var node in questionDefinitions)
                {
                    QuestionDefinitions.Add(node);
                }
            }
        }

        public string PageLayoutId { get; set; }

        public string PageThemeId { get; set; }

        public Theme PageThemeOverrides { get; set; }

        public List<QuestionDefinition> QuestionDefinitions { get; set; }

        public List<SkipCommand> SkipCommands { get; set; }

        public OrderType OrderType { get; set; }
        public int Seed { get; set; }

        public string ResponseStatus { get; set; }

        public NavigationButtonSettings NavigationButtonSettings { get; set; }

        [JsonIgnore]
        public override IList<string> QuestionAliases
        {
            get { return QuestionDefinitions.Select(questionDefinition => questionDefinition.Alias).ToList(); }
        }

        public LanguageString Title { get; set; }

        public LanguageString Description { get; set; }

        [JsonIgnore]
        public IList<string> QuestionIds { get; set; }
    }
}