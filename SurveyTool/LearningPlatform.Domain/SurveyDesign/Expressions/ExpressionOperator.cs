namespace LearningPlatform.Domain.SurveyDesign.Expressions
{
    public enum ExpressionOperator
    {
        IsEqual,
        IsNotEqual,
        IsSelected,
        IsNotSelected,
        IsShown,
        IsNotShown,
        GreaterThan,
        GreaterThanOrEqual,
        LessThan,
        LessThanOrEqual,
        IsTrue,
        IsFalse,
        Contains,
        NotContains,
        Custom
        //DateAfter,
        //DateBefore,
        //IsMatchingRegExp,
        //IsNotMatchingReqexp,
    }
}