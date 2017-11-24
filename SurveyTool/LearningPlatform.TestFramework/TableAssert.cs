using LearningPlatform.Domain.SurveyExecution.TableLayout;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace LearningPlatform.TestFramework
{
    public static class TableAssert
    {
        public static void AreEqual(ITableCell[][] expect, Table actual)
        {
            for (int rowIndex = 0; rowIndex < actual.RowCount; rowIndex++)
            {
                for (int columnIndex = 0; columnIndex < actual.ColumnCount; columnIndex++)
                {
                    Assert.AreEqual(expect[rowIndex][columnIndex], actual.GetTableCell(rowIndex, columnIndex));
                }
            }
        }
    }
}