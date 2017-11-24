using System.Data.SqlClient;

namespace LearningPlatform.ResponseDataIndexer
{
    public static class SqlHelper
    {
        public static SqlDataReader GetDataReader(string queryString, SqlConnection connection, int? sysChangeVersion)
        {
            var command = new SqlCommand(queryString, connection) { CommandTimeout = 60 * 15 };
            if (sysChangeVersion.HasValue)
            {
                command.Parameters.Add(new SqlParameter("SYS_CHANGE_VERSION", sysChangeVersion));
            }
            connection.Open();
            return command.ExecuteReader();
        }
    }
}