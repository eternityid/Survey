using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyDesign.Questions.Options
{
    public class OptionList
    {
        public OptionList()
        {
            OptionGroups = new List<OptionGroup>();
        }

        public string Id { get; set; }
        public string Name { get; set; }
        public string SurveyId { get; set; }
        public List<OptionGroup> OptionGroups { get; set; }

        public List<Option> Options { get; set; }
    }
}