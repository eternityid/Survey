using LearningPlatform.Domain.SurveyExecution.Questions;
using LearningPlatform.Domain.SurveyExecution.RepositoryContracts;
using LearningPlatform.Domain.SurveyExecution.Request;
using LearningPlatform.Domain.SurveyExecution.ResponseRows;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;

namespace LearningPlatform.SurveyExecution.Data.Repositories.Sql
{
    internal class ResponseRowSqlRepository : IResponseRowRepository
    {
        private readonly IRequestContext _requestContext;

        public ResponseRowSqlRepository(IRequestContext requestContext)
        {
            _requestContext = requestContext;
        }

        const string ColumnNames = @"SurveyId, RespondentId, QuestionName, AnswerType, Alias, IntegerAnswer, DateTimeAnswer, TextAnswer, DoubleAnswer, LoopState";

        private DbConnection Connection
        {
            get { return new SqlConnection(ConfigurationManager.ConnectionStrings["ResponsesContext"].ConnectionString); }
        }

        private string TableName
        {
            get { return ResponseRowTableName.TableName(_requestContext.IsTesting); }
        }


        public IEnumerable<ResponseRow> GetRows(IList<Question> questions, long respondentId, string surveyId)
        {
            if (!questions.Any()) yield break;

            using (var connection = Connection)
            {
                connection.Open();
                using (var command = connection.CreateCommand())
                {
                    var inClauseSqlParameters = GetInClauseSqlParameters(questions.Select(p => p.Alias));
                    var inClause = string.Join(", ", inClauseSqlParameters.Select(p => p.ParameterName));
                    command.CommandText = string.Format(@"SELECT {0} FROM {1} WHERE RespondentId=@RespondentId AND SurveyId=@SurveyId AND QuestionName IN ({2})", ColumnNames, TableName, inClause);
                    command.CommandType = CommandType.Text;
                    command.Parameters.Add(new SqlParameter("@RespondentId", respondentId));
                    command.Parameters.Add(new SqlParameter("@SurveyId", surveyId));
                    command.Parameters.AddRange(inClauseSqlParameters.ToArray());
                    var dbDataReader = command.ExecuteReader();


                    if(dbDataReader.HasRows)
                    {
                        while(dbDataReader.Read())
                        {
                            yield return new ResponseRow
                            {
                                SurveyId = dbDataReader.GetString(0),
                                RespondentId = dbDataReader.GetInt64(1),
                                QuestionName =  dbDataReader.GetString(2),
                                AnswerType = (AnswerType) dbDataReader.GetInt16(3),
                                Alias = dbDataReader.GetValueOrDefault<string>(4),
                                IntegerAnswer = dbDataReader.GetValueOrDefault<int?>(5),
                                DateTimeAnswer = dbDataReader.GetValueOrDefault<DateTime?>(6),
                                TextAnswer = dbDataReader.GetValueOrDefault<string>(7),
                                DoubleAnswer = dbDataReader.GetValueOrDefault<Double?>(8),
                                LoopState = LoopState.Create(dbDataReader.GetValueOrDefault<string>(9))
                            };
                        }
                    }
                }
            }
        }

        private static List<SqlParameter> GetInClauseSqlParameters(IEnumerable<string> questions)
        {
            int paramNumber = 1;
            var parameters = questions.Select(q => new SqlParameter("@" + paramNumber++, q)).ToList();
            return parameters;
        }


        private static DataTable CreateDataTable(IEnumerable<ResponseRow> responseRows)
        {
            var table = new DataTable();
            table.Columns.Add("SurveyId", typeof(string));
            table.Columns.Add("RespondentId", typeof(long));
            table.Columns.Add("QuestionName", typeof(string));
            table.Columns.Add("AnswerType", typeof(short));
            table.Columns.Add("Alias", typeof(string));
            table.Columns.Add("IntegerAnswer", typeof(int));
            table.Columns.Add("DateTimeAnswer", typeof(DateTime));
            table.Columns.Add("TextAnswer", typeof(string));
            table.Columns.Add("DoubleAnswer", typeof(double));
            table.Columns.Add("LoopState", typeof(string));
            //table.Columns.Add("GeoAnswer", typeof(DbGeography));

            var keys = new HashSet<string>();
            foreach (var row in responseRows)
            {
                var key = string.Format("{0}_{1}_{2}_{3}_{4}", row.SurveyId, row.RespondentId, row.QuestionName,
                    row.LoopState.Value, row.Alias);
                // Avoid adding duplicate rows.
                // This can happen if the same alias is used multiple times for a question.
                // This should not happen, but if the survey is like that, it should not crash.
                if (!keys.Contains(key))
                {
                    keys.Add(key);
                    table.Rows.Add(row.SurveyId, row.RespondentId, row.QuestionName,
                        (short) row.AnswerType, row.Alias, row.IntegerAnswer, row.DateTimeAnswer,
                        row.TextAnswer, row.DoubleAnswer,
                        row.LoopState == null ? "" : row.LoopState.ToString());
                }
            }
            return table;
        }

        public void Update(IEnumerable<ResponseRow> responseRows)
        {
            using (var connection = Connection)
            {
                connection.Open();
                using (var command = connection.CreateCommand())
                {
                    command.CommandText = string.Format(
@"MERGE 
   {0}
USING @Source AS s 
ON {0}.SurveyId = s.SurveyId
   AND {0}.RespondentId = s.RespondentId
   AND {0}.QuestionName = s.QuestionName
   AND {0}.LoopState = s.LoopState
   AND ({0}.Alias = s.Alias OR ({0}.Alias is null AND s.Alias is null))
WHEN MATCHED THEN
   UPDATE SET IntegerAnswer=s.IntegerAnswer, DateTimeAnswer=s.DateTimeAnswer, TextAnswer = s.TextAnswer, DoubleAnswer = s.DoubleAnswer
WHEN NOT MATCHED THEN
   INSERT ({1})
   VALUES ({1})
; ", TableName, ColumnNames);
                    command.CommandType = CommandType.Text;

                    var parameter = new SqlParameter("@Source", CreateDataTable(responseRows));
                    command.Parameters.Add(parameter);
                    parameter.SqlDbType = SqlDbType.Structured;
                    parameter.TypeName = "dbo.AnswersType";

                    command.ExecuteNonQuery();
                }
            }
        }

        public void Delete(IList<string> questionIds,long respondentId, string surveyId)
        {
            if (!questionIds.Any())
                return;
            using (var connection = Connection)
            {
                connection.Open();
                using (var command = connection.CreateCommand())
                {
                    var parameters = GetInClauseSqlParameters(questionIds);
                    var inClause = string.Join(", ", parameters.Select(p => p.ParameterName));

                    command.CommandText = string.Format(@"DELETE FROM {0} WHERE RespondentId=@RespondentId AND SurveyId=@SurveyId AND QuestionName IN ({1})", TableName, inClause);
                    command.CommandType = CommandType.Text;
                    command.Parameters.Add(new SqlParameter("@RespondentId", respondentId));
                    command.Parameters.Add(new SqlParameter("@SurveyId", surveyId));
                    command.Parameters.AddRange(parameters.ToArray());

                    command.ExecuteNonQuery();
                }
            }
        }

        public IList<ResponseRow> GetAll(string surveyId)
        {
            throw new InvalidOperationException("This method only works in the memory repository");
        }
    }
}