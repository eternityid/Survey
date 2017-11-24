using System;
using System.Collections.Generic;
using LearningPlatform.Domain.SurveyExecution.Options;

namespace LearningPlatform.TestFramework
{
    public class OptionComparer : IComparer<Option>
    {
            
        public int Compare(Option x, Option y)
        {
            return x.Alias.CompareTo(y.Alias) |
                string.Compare(x.Text, y.Text, StringComparison.Ordinal);
        }
    }
}