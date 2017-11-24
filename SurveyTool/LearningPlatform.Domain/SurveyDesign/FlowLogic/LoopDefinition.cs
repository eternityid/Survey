using System.Collections.Generic;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using Newtonsoft.Json;

namespace LearningPlatform.Domain.SurveyDesign.FlowLogic
{
    public class LoopDefinition : IHasOptions
    {
        public long Id { get; set; }

        public int Seed { get; set; }
        public OptionsMask OptionsMask { get; set; }
        public OrderType OrderType { get; set; }
        public OrderType OptionsOrderType { get; set; }
        public OptionList OptionList { get; set; }
        [JsonIgnore]
        public string OptionListId { get; set; }

        public IList<Option> GetOptions()
        {
            return OptionList.Options;
        }
    }
}