using System;

namespace LearningPlatform.Domain.SurveyExecution.TableLayout
{
    public class DateCell : ITableCell
    {
        public DateTime Date { get; set; }

        public override bool Equals(object obj)
        {
            var dateCell = obj as DateCell;
            if (dateCell == null) return false;

            return Date == dateCell.Date;
        }

        public override int GetHashCode()
        {
            return Date.GetHashCode();
        }

    }
}