using System;

namespace LearningPlatform.Domain.SurveyExecution.TableLayout
{
    public class NumberCell : ITableCell
    {
        public double Value { get; set; }

        public override bool Equals(object obj)
        {
            var numberCell = obj as NumberCell;
            if (numberCell == null) return false;

            return Math.Abs(Value - numberCell.Value) < 0.00000000000000001;
        }

        public override int GetHashCode()
        {
            return Value.GetHashCode();
        }
    }
}