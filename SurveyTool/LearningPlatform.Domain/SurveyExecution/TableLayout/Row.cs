using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyExecution.TableLayout
{
    public class Row
    {
        public Row()
        {
            Items = new List<ITableCell>();
        }
        public List<ITableCell> Items { get; private set; }

        public int Count
        {
            get { return Items.Count; }
        }

        public void AddItem(ITableCell item)
        {
            Items.Add(item);
        }

        public void AddItems(IEnumerable<ITableCell> items)
        {
            Items.AddRange(items);
        }

        public override int GetHashCode()
        {
            return (Items != null ? Items.GetHashCode() : 0);
        }

        public override bool Equals(object obj)
        {
            var row = obj as Row;
            if (row == null) return false;
            if (Count != row.Count) return false;
            for (int j = 0; j < Count; j++)
            {
                if (!Equals(Items[j], row.Items[j])) return false;
            }
            return true;
        }
    }
}