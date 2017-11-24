using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.LanguageStrings;

namespace LearningPlatform.Domain.SurveyDesign.Questions.Options
{
    public class Option : IFixedPosition
    {
        private OptionsMask _optionsMask;

        public string Id { get; set; }
        public LanguageString Text { get; set; }
        public string Alias { get; set; }
        public bool IsFixedPosition { get; set; }
        public bool IsExclusive { get; set; }
        public bool IsNotApplicable { get; set; }
        public string ListId { get; set; }
        public QuestionDefinition OtherQuestionDefinition { get; set; }
        public string OtherQuestionDefinitionId { get; set; }
        public string ReferenceListId { get; set; }
        public int Position { get; set; }

        public OptionsMask OptionsMask
        {
            get { return _optionsMask ?? (_optionsMask = new OptionsMask()); }
            set { _optionsMask = value; }
        }
        public string PictureName { get; set; }
        public string GroupAlias { get; set; }
    }
}