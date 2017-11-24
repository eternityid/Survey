using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Respondents;
using LearningPlatform.Domain.SurveyExecution.ResponseRows;

namespace LearningPlatform.SurveyExecution.Data.Repositories.Sql
{
    public class BulkCopyResponses : IBulkCopyResponses
    {
        private SqlConnection Connection
        {
            get
            {
                return new SqlConnection(ConfigurationManager.ConnectionStrings["ResponsesContext"].ConnectionString);
            }
        }


        public void AddBulkResponses(IList<Respondent> respondents, IList<ResponseRow> responseRows, string surveyId, bool isTesting)
        {
            if(respondents == null) throw new ArgumentNullException("respondents");
            if (responseRows == null) throw new ArgumentNullException("responseRows");

            using (var connection = Connection)
            {
                connection.Open();

                using (SqlTransaction transaction = connection.BeginTransaction())
                {
                    try
                    {
                        var respondentTableName = RespondentTableName.TableName(isTesting);
                        using (var bulkCopyRespondents = new SqlBulkCopy(connection, SqlBulkCopyOptions.Default, transaction))
                        {
                            bulkCopyRespondents.BatchSize = 1000;
                            bulkCopyRespondents.DestinationTableName = respondentTableName;
                            bulkCopyRespondents.WriteToServer(RespondentsToDataTable(respondents));
                        }
                        long maxRespondentId;
                        using (var command = connection.CreateCommand())
                        {
                            command.CommandText = string.Format("SELECT IDENT_CURRENT ('{0}')", respondentTableName);
                            command.CommandType = CommandType.Text;
                            command.Transaction = transaction;
                            maxRespondentId = (long)((decimal)command.ExecuteScalar());
                        }

                        using (var bulkCopyResponses = new SqlBulkCopy(connection, SqlBulkCopyOptions.Default, transaction))
                        {
                            bulkCopyResponses.BatchSize = 1000;
                            bulkCopyResponses.DestinationTableName = ResponseRowTableName.TableName(isTesting);
                            bulkCopyResponses.WriteToServer(ResponseRowsToDataTable(responseRows, maxRespondentId - respondents.Count));
                        }
                        transaction.Commit();

                    }
                    catch (Exception)
                    {
                        transaction.Rollback();
                        throw;
                    }
                }
            }
        }

        private DataTable RespondentsToDataTable(IList<Respondent> respondents)
        {
            var dataTable = new DataTable
            {
                Columns =
                {
                    new DataColumn("Id", typeof (long)) {AutoIncrement = true},
                    new DataColumn("Language", typeof (string)),
                    new DataColumn("Credential", typeof (string)),
                    new DataColumn("SurveyId", typeof (string)),
                    new DataColumn("CurrentPageId", typeof (string)),
                    new DataColumn("CurrentLoopState", typeof (string)),
                    new DataColumn("CurrentGotoStack", typeof (string)),
                    new DataColumn("CurrentSkipStack", typeof (string)),
                    new DataColumn("EmailAddress", typeof (string)),
                    new DataColumn("NumberSent", typeof (int)),
                    new DataColumn("LastTimeSent", typeof (DateTime)) {AllowDBNull = true},
                    new DataColumn("Started", typeof (DateTime)) {AllowDBNull = true},
                    new DataColumn("LastModified", typeof (DateTime)) {AllowDBNull = true},
                    new DataColumn("Completed", typeof (DateTime)) {AllowDBNull = true},
                    new DataColumn("ResponseStatus", typeof (string)),
                    new DataColumn("IsMobile", typeof (bool)),
                    new DataColumn("ScreenPixelsHeight", typeof (int)),
                    new DataColumn("ScreenPixelsWidth", typeof (int)),
                    new DataColumn("TouchEvents", typeof (string)),
                    new DataColumn("UserAgent", typeof (string))


                }
            };
            dataTable.PrimaryKey = new[] {dataTable.Columns["Id"]};

            foreach (var respondent in respondents)
            {
                var row = dataTable.NewRow();
                row["SurveyId"] = respondent.SurveyId;
                row["Language"] = (object)respondent.Language ?? DBNull.Value;
                row["Credential"] = respondent.Credential;
                row["EmailAddress"] = respondent.EmailAddress;
                row["NumberSent"] = respondent.NumberSent;
                row["Started"] = (object)respondent.Started ?? DBNull.Value;
                row["LastModified"] = (object)respondent.LastModified ?? DBNull.Value;
                row["Completed"] = (object)respondent.Completed ?? DBNull.Value;
                row["ResponseStatus"] = GetStatusString(respondent);
                row["IsMobile"] = respondent.IsMobile;
                row["ScreenPixelsWidth"] = respondent.ScreenPixelsWidth;
                row["ScreenPixelsHeight"] = respondent.ScreenPixelsHeight;
                row["TouchEvents"] = respondent.TouchEvents ?? string.Empty;
                row["UserAgent"] = respondent.UserAgent ?? string.Empty;
                row["CurrentLoopState"] = respondent.CurrentLoopState ?? string.Empty;
                row["CurrentGotoStack"] = respondent.CurrentGotoStack ?? string.Empty;
                row["CurrentSkipStack"] = respondent.CurrentSkipStack ?? string.Empty;
                dataTable.Rows.Add(row);
            }
            dataTable.AcceptChanges();
            return dataTable;
        }

        private static SqlString GetStatusString(Respondent respondent)
        {
            ResponseStatus statusCode = respondent.ResponseStatusCode;
            return statusCode == ResponseStatus.Custom ? respondent.ResponseStatus : statusCode.ToString();
        }


        private DataTable ResponseRowsToDataTable(IList<ResponseRow> responseRows, long maxRespondentId)
        {
            var dataTable = new DataTable
            {
                Columns =
                {
                    new DataColumn("Id", typeof (long)) {AutoIncrement = true},
                    new DataColumn("SurveyId", typeof (string)),
                    new DataColumn("RespondentId", typeof (long)),
                    new DataColumn("Alias", typeof (string)),
                    new DataColumn("QuestionName", typeof (string)),
                    new DataColumn("AnswerType", typeof (short)),
                    new DataColumn("IntegerAnswer", typeof (int)) {AllowDBNull = true},
                    new DataColumn("TextAnswer", typeof (string)),
                    new DataColumn("DateTimeAnswer", typeof (DateTime)) {AllowDBNull = true},
                    new DataColumn("DoubleAnswer", typeof (double)) {AllowDBNull = true},
                    new DataColumn("LoopState", typeof (string)),
                }
            };
            dataTable.PrimaryKey = new[] { dataTable.Columns["Id"] };

            foreach (var responseRow in responseRows)
            {
                var row = dataTable.NewRow();
                row["SurveyId"] = responseRow.SurveyId;
                row["RespondentId"] = responseRow.RespondentId + maxRespondentId;
                row["Alias"] = responseRow.Alias;
                row["QuestionName"] = responseRow.QuestionName;
                row["AnswerType"] = responseRow.AnswerType;
                row["IntegerAnswer"] = (object)responseRow.IntegerAnswer ?? DBNull.Value;
                row["TextAnswer"] = responseRow.TextAnswer;
                row["DateTimeAnswer"] = (object)responseRow.DateTimeAnswer ?? DBNull.Value;
                row["DoubleAnswer"] = (object)responseRow.DoubleAnswer ?? DBNull.Value;
                row["LoopState"] = responseRow.LoopState;

                dataTable.Rows.Add(row);
            }
            dataTable.AcceptChanges();

            return dataTable;
        }

    }
}