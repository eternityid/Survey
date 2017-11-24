using System.Data.Common;

namespace LearningPlatform.SurveyExecution.Data
{
    public static class DataReaderExtensions
    {
        public static T GetValueOrDefault<T>(this DbDataReader dataReader, int ordinal)
        {
            return !dataReader.IsDBNull(ordinal) ? (T)dataReader.GetValue(ordinal) : default(T);
        }
    }
}