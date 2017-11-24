using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace LearningPlatform.ResponseDataIndexer
{
    public class AnswerReader
    {
        public static void Read(UpsertedDocumentCollection upsertedDocumentCollection, bool isTesting)
        {
            int? sysChangeVersion = ElasticsearchService.GetAnswerChangeVersion(isTesting);

            using (var connection = new SqlConnection(Config.SqlConnectionString))
            {
                SqlDataReader reader = GetDataReader(connection, sysChangeVersion, isTesting);
                while (reader.Read())
                {
                    var surveyId = Convert.ToString(reader["SurveyId"]);
                    var respondentId = Convert.ToInt64(reader["RespondentId"]);
                    var document = upsertedDocumentCollection.GetOrCreateDocument(surveyId, respondentId);
                    UpdateAnswer(reader, document);
                }
                reader.Close();
            }
        }

        private static SqlDataReader GetDataReader(SqlConnection connection, int? sysChangeVersion, bool isTesting)
        {
            string queryString = sysChangeVersion.HasValue
                ? GetQueryStringForChangedAnswers(isTesting)
                : GetQueryStringForAllAnswers(isTesting);
            return SqlHelper.GetDataReader(queryString, connection, sysChangeVersion);
        }

        private static void UpdateAnswer(SqlDataReader reader, Document document)
        {
            document.AnswerChangeVersion = Convert.ToInt32(reader["SYS_CHANGE_VERSION"]);
            var answerType = (AnswerType)Convert.ToInt16(reader["AnswerType"]);
            switch (answerType)
            {
                case AnswerType.Single:
                case AnswerType.Open:
                    UpdateSingleOrOpenAnswer(reader, document);
                    break;
                case AnswerType.Number:
                    UpdateNumericAnswer(reader, document);
                    break;
                case AnswerType.Date:
                    UpdateDateAnswer(reader, document);
                    break;
                case AnswerType.Multi:
                    UpdateMultiAnswer(reader, document);
                    break;
                default:
                    Logger.Log("Warning! Unknown question type {0} for [{1}] of respondent [{2}]",  answerType, reader["QuestionName"], document["_RespondentId"]);
                    break;
            }
        }

        private static void UpdateSingleOrOpenAnswer(SqlDataReader reader, Document document)
        {
            var currentQuestionName = reader["QuestionName"].ToString();
            var answer = reader["TextAnswer"].ToString();

            document[currentQuestionName] = string.IsNullOrEmpty(answer) ? null : answer;
        }

        private static void UpdateNumericAnswer(SqlDataReader reader, Document document)
        {
            var currentQuestionName = $"{reader["QuestionName"]}:number";
            var answer = reader["DoubleAnswer"].ToString();
            document[currentQuestionName] = string.IsNullOrEmpty(answer) ? 0 : double.Parse(answer);
        }

        private static void UpdateDateAnswer(SqlDataReader reader, Document document)
        {
            var currentQuestionName = $"{reader["QuestionName"]}:date";
            var answer = reader["DateTimeAnswer"].ToString();
            if (string.IsNullOrEmpty(answer))
            {
                document[currentQuestionName] = null;
            }
            else
            {
                document[currentQuestionName] = Convert.ToDateTime(answer);
            }
        }

        private static void UpdateMultiAnswer(SqlDataReader reader, Document document)
        {
            var currentQuestionName = $"{reader["QuestionName"]}:multi";

            var multiAnswer = new List<string>();
            if (document[currentQuestionName] != null)
            {
                var currentMultiAnswer = document[currentQuestionName] as List<string>;
                if (currentMultiAnswer != null) multiAnswer = currentMultiAnswer;
            }

            var alias = reader["Alias"].ToString();
            if (reader["IntegerAnswer"].ToString().Equals("1"))
            {
                if (!multiAnswer.Contains(alias))
                {
                    multiAnswer.Add(alias);
                }
            }
            if (reader["IntegerAnswer"].ToString().Equals("0"))
            {
                if (multiAnswer.Contains(alias))
                {
                    multiAnswer.Remove(alias);
                }
            }

            document[currentQuestionName] = multiAnswer;
        }

        private static string GetQueryStringForChangedAnswers(bool isTesting)
        {
            return string.Format(
                @"SELECT SYS_CHANGE_VERSION, SYS_CHANGE_OPERATION, CT.Id, Answers.SurveyId, Answers.RespondentId, Answers.Alias,
                      Answers.QuestionName, Answers.AnswerType, Answers.IntegerAnswer, Answers.TextAnswer, Answers.DoubleAnswer, Answers.DateTimeAnswer 
                      FROM CHANGETABLE(CHANGES [dbo].[{0}],0) AS CT JOIN [dbo].[{0}] AS Answers ON Answers.Id = CT.Id
                      WHERE SYS_CHANGE_VERSION > @SYS_CHANGE_VERSION 
                      ORDER BY SYS_CHANGE_VERSION, RespondentId, QuestionName; ",
                GetTableName(isTesting));
        }

        private static string GetQueryStringForAllAnswers(bool isTesting)
        {
            return string.Format(
                @"SELECT ISNULL((SELECT MAX(SYS_CHANGE_VERSION) FROM CHANGETABLE(CHANGES [dbo].[{0}],0) as ct),0) as SYS_CHANGE_VERSION, Answers.Id, Answers.SurveyId, Answers.RespondentId, Answers.Alias,
                      Answers.QuestionName, Answers.AnswerType, Answers.IntegerAnswer, Answers.TextAnswer, Answers.DoubleAnswer, Answers.DateTimeAnswer
                      FROM [dbo].[{0}] AS Answers
                      ORDER BY RespondentId, QuestionName; ",
                GetTableName(isTesting));
        }

        private static string GetTableName(bool isTesting)
        {
            return isTesting ? "TestAnswers" : "Answers";
        }
    }
}
