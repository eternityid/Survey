using System;

namespace LearningPlatform.Domain.SurveyExecution.ResponseRows
{
    public class LoopStateItem
    {
        public string LoopAlias { get; set; }
        public string OptionAlias { get; set; }
        public override string ToString()
        {
            return string.Format("{0}={1}", LoopAlias, OptionAlias);
        }

        public static LoopStateItem Create(string itemString)
        {
            var items = itemString.Split(new[] { '=' }, StringSplitOptions.None);
            return new LoopStateItem
            {
                LoopAlias = items[0],
                OptionAlias = items[1]
            };
        }
    }
}