using System.Collections.Generic;
using System.Data.Common;

namespace LearningPlatform.Domain.Respondents
{
    public class SearchCondition
    {
        public SearchCondition(string condition, List<DbParameter> parameters)
        {
            Condition = condition;
            Parameters = parameters;
        }
        public string Condition { get; set; }
        public List<DbParameter> Parameters { get; set; }
    }
}