using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.LanguageStrings;

namespace LearningPlatform.Domain.SurveyDesign.Questions.Options
{
    public class OptionGroup
    {
        public string Id { get; set; }
        public string Alias { get; set; }
        public LanguageString Heading { get; set; }
        public OrderType? OrderType { get; set; }
        public string ListId { get; set; }
        public bool HideHeading { get; set; }
        public int Position { get; set; }
    }
}