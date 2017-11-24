using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearningPlatform.Domain.SurveyExecution.TableLayout
{
    public class OpenEndedTextCell : ITableCell
    {
        public OpenEndedTextCell(string id, string answer = null, int? rows = null)
        {
            Id = id;
            Answer = answer;
            Rows = rows;
        }

        public string Id { get; set; }
        public string Answer { get; set; }
        public int? Rows { get; set; }
        public bool IsLongText
        {
            get { return Rows != null; }
        }

        public override bool Equals(object obj)
        {
            var checkedItem = obj as OpenEndedTextCell;
            if (checkedItem == null) return false;

            return obj.GetType() == GetType()
                   && Id == checkedItem.Id;
        }

        public override int GetHashCode()
        {
            int hash = 0;
            if (Id != null) hash |= Id.GetHashCode();
            return hash;
        }
    }
}
