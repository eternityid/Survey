using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Domain.SurveyDesign.Expressions
{
    public class Expression
    {
        public long Id { get; set; }
        public List<ExpressionItem> ExpressionItems { get; set; }

        public string SurveyId { get; set; }

        public IList<ExpressionItem> GetItems()
        {
            return ExpressionItems.OrderBy(p => p.Position).ToList();
        }
    }
}