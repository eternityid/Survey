using Newtonsoft.Json;

namespace LearningPlatform.Domain.SurveyDesign.Expressions
{
    public class ExpressionItem
    {
        public long Id { get; set; }
        public string QuestionId { get; set; }
        public string OptionId { get; set; }
        public ExpressionOperator? Operator { get; set; }
        public string Value { get; set; }
        public ExpressionLogicalOperator? LogicalOperator { get; set; }
        public int Indent { get; set; }
        [JsonIgnore]
        public int Position { get; set; }
        public long ExpressionId { get; set; }

        //TODO: Remove these and instead use emum serialized as string
        public string OperatorString => (Operator != null) ? Operator.ToString() : string.Empty;

        //TODO: Remove these and instead use emum serialized as string
        public string LogicalOperatorString => (LogicalOperator != null) ? LogicalOperator.ToString() : string.Empty;
    }
}