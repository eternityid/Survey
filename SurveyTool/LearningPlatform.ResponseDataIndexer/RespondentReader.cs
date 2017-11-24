using System;
using System.Data.SqlClient;

namespace LearningPlatform.ResponseDataIndexer
{
    public class RespondentReader
    {

        public static void Read(ChangedDocumentsStore changedDocumentsStore, bool isTesting)
        {
            var sysChangeVersion = ElasticsearchService.GetRespondentChangeVersion(isTesting);
	        const string deleteSysChangeOperation = "D";

            using (var connection = new SqlConnection(Config.SqlConnectionString))
            {
                using (var reader = GetDataReader(isTesting, connection, sysChangeVersion))
                {
                    while (reader.Read())
                    {
	                    var surveyId = Convert.ToString(reader["SurveyId"]);
	                    var respondentId = Convert.ToInt64(reader["Id"]);
	                    var respondentChangeVersion = Convert.ToInt32(reader["SYS_CHANGE_VERSION"]);
						var changeOperation = Convert.ToString(reader["SYS_CHANGE_OPERATION"]);
	                    if (changeOperation == deleteSysChangeOperation)
	                    {
							changedDocumentsStore.DeletedDocuments.Add(new Document
							{
								SurveyId = surveyId,
								RespondentId = respondentId,
								RespondentChangeVersion = respondentChangeVersion
							});
	                    }
	                    else
	                    {
		                    var upsertedDocument = changedDocumentsStore.UpsertedDocuments.GetOrCreateDocument(surveyId, respondentId);
							upsertedDocument.RespondentChangeVersion = Convert.ToInt32(reader["SYS_CHANGE_VERSION"]);
							ReadUpsertedRespondent(reader, upsertedDocument);
						}
                    }
                    reader.Close();
                }
            }
        }

        private static SqlDataReader GetDataReader(bool isTesting, SqlConnection connection, int? sysChangeVersion)
        {
            var queryString = sysChangeVersion.HasValue
                ? GetQueryStringForChangedRespondents(isTesting)
                : GetQueryStringAllRespondents(isTesting);
            return SqlHelper.GetDataReader(queryString, connection, sysChangeVersion);
        }

        private static void ReadUpsertedRespondent(SqlDataReader reader, Document document)
        {
            document["_ResponseStatus"] = Convert.ToString(reader["ResponseStatus"]);
            if (!(reader["Started"] is DBNull)) document["_Started"] = Convert.ToDateTime(reader["Started"]);
            if (!(reader["LastModified"] is DBNull)) document["_LastModified"] = Convert.ToDateTime(reader["LastModified"]);
            if (!(reader["Completed"] is DBNull)) document["_Completed"] = Convert.ToDateTime(reader["Completed"]);
            if (!(reader["LastTimeSent"] is DBNull)) document["_LastTimeSent"] = Convert.ToDateTime(reader["LastTimeSent"]);
        }

	    private static string GetQueryStringForChangedRespondents(bool isTesting)
        {
            return string.Format(
                @"SELECT SYS_CHANGE_VERSION, SYS_CHANGE_OPERATION, CT.Id, Respondents.SurveyId, Respondents.LastTimeSent, Respondents.Started, Respondents.LastModified, Respondents.Completed, Respondents.ResponseStatus
                  FROM CHANGETABLE(CHANGES {0},0) AS CT LEFT JOIN [dbo].[{0}] AS Respondents ON Respondents.Id = CT.Id 
                  WHERE SYS_CHANGE_VERSION > @SYS_CHANGE_VERSION ORDER BY SYS_CHANGE_VERSION ", GetTableName(isTesting));
        }

        private static string GetQueryStringAllRespondents(bool isTesting)
        {
            return string.Format(
                @"SELECT ISNULL((SELECT MAX(SYS_CHANGE_VERSION) FROM CHANGETABLE(CHANGES [dbo].[{0}],0) as ct),0) as SYS_CHANGE_VERSION, Respondents.Id, Respondents.SurveyId, Respondents.LastTimeSent, Respondents.Started, Respondents.LastModified, Respondents.Completed, Respondents.ResponseStatus
                  FROM [dbo].[{0}] AS Respondents 
                  ORDER BY Id ", GetTableName(isTesting));
        }

        private static string GetTableName(bool isTesting)
        {
            return isTesting ? "TestRespondents" : "Respondents";
        }
    }
}