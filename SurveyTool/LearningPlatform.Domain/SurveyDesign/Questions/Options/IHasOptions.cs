using System.Collections.Generic;
using LearningPlatform.Domain.Common;

namespace LearningPlatform.Domain.SurveyDesign.Questions.Options
{
    public interface IHasOptions
    {
        int Seed { get; set; }
        OptionsMask OptionsMask { get; set; }
        OrderType OrderType { get; set; }
        IList<Option> GetOptions();
        OptionList OptionList { get; set; }
    }
}