using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Domain.SurveyExecution.TableLayout
{
    public class Table
    {
        public Table()
        {
            Rows = new List<Row>();
        }

        public List<Row> Rows { get; private set; }

        public bool Transposed { get; set; }

        public Row AddRow()
        {
            var row = new Row();
            Rows.Add(row);
            return row;
        }

        public Row AddRow(params ITableCell[] items)
        {
            var row = AddRow();
            row.AddItems(items);
            return row;
        }

        public override int GetHashCode()
        {
            return (Rows != null ? Rows.GetHashCode() : 0);
        }

        public ITableCell GetTableCell(int rowIndex, int columnIndex)
        {
            if (Transposed) return Rows[rowIndex].Items[columnIndex];
            return Rows[columnIndex].Items[rowIndex];
        }

        public bool IsHeaderRow(int rowIndex, int columnIndex, int numberOfHeaderRows)
        {
            if (Transposed) return (columnIndex >= 0 && columnIndex < numberOfHeaderRows) || rowIndex == 0;
            return (rowIndex >= 0 && rowIndex < numberOfHeaderRows) || columnIndex == 0;
        }


        public int RowCount
        {
            get
            {
                if (Transposed) return Rows.Count;
                return Rows.Count > 0 ? Rows[0].Count : 0;
            }
        }


        public int ColumnCount
        {
            get
            {
                if (!Transposed) return Rows.Count;
                return Rows.Count > 0 ? Rows[0].Count : 0;
            }


        }

        public override bool Equals(object obj)
        {
            var table = obj as Table;
            if (table == null) return false;
            if (table.Rows.Count != Rows.Count) return false;
            return !table.Rows.Where((t, i) => !Equals(t, Rows[i])).Any();
        }
    }
}