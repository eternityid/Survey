using LearningPlatform.Domain.Respondents;
using LearningPlatform.Domain.SurveyExecution.RepositoryContracts;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;

namespace LearningPlatform.SurveyExecution.Data.Repositories.Sql
{
    internal class RespondentSurveyExecutionSqlRepository : IRespondentSurveyExecutionRepository
    {
        private SqlConnection CreateConnection()
        {
            return new SqlConnection(ConfigurationManager.ConnectionStrings["ResponsesContext"].ConnectionString);
        }

        private string TableName(bool isTesting)
        {
            return RespondentTableName.TableName(isTesting);
        }

        public Respondent Get(long respondentId, string surveyId, bool isTesting)
        {
            var respondent = GetRespondent(CreateCommandWithId(respondentId, surveyId, isTesting));
            if (respondent == null) throw new Exception("Respondent not found");
            return respondent;
        }

        public Respondent GetWithExternalId(string externalId, string surveyId, bool isTesting)
        {
            return GetRespondent(CreateCommandWithExternalId(externalId, surveyId, isTesting));
        }

        private Respondent GetRespondent(SqlCommand command)
        {
            using (var connection = CreateConnection())
            {
                connection.Open();
                command.Connection = connection;
                using (command)
                {
                    var dbDataReader = command.ExecuteReader();

                    if (dbDataReader.HasRows)
                    {
                        if (dbDataReader.Read())
                        {
                            return new Respondent
                            {
                                Id = dbDataReader.GetValueOrDefault<long>(0),
                                SurveyId = dbDataReader.GetValueOrDefault<string>(1),
                                Language = dbDataReader.GetValueOrDefault<string>(2),
                                Credential = dbDataReader.GetValueOrDefault<string>(3),
                                CurrentPageId = dbDataReader.GetValueOrDefault<string>(4),
                                ResponseStatus = dbDataReader.GetValueOrDefault<string>(5),
                                EmailAddress = dbDataReader.GetValueOrDefault<string>(6),
                                NumberSent = dbDataReader.GetValueOrDefault<int>(7),
                                LastTimeSent = dbDataReader.GetValueOrDefault<DateTime?>(8),
                                Started = dbDataReader.GetValueOrDefault<DateTime?>(9),
                                LastModified = dbDataReader.GetValueOrDefault<DateTime?>(10),
                                Completed = dbDataReader.GetValueOrDefault<DateTime?>(11),
                                IsMobile = dbDataReader.GetValueOrDefault<bool>(12),
                                TouchEvents = dbDataReader.GetValueOrDefault<string>(13),
                                ScreenPixelsWidth = dbDataReader.GetValueOrDefault<int>(14),
                                ScreenPixelsHeight = dbDataReader.GetValueOrDefault<int>(15),
                                UserAgent = dbDataReader.GetValueOrDefault<string>(16),
                                CurrentLoopState = dbDataReader.GetValueOrDefault<string>(17),
                                CurrentGotoStack = dbDataReader.GetValueOrDefault<string>(18),
                                CurrentSkipStack = dbDataReader.GetValueOrDefault<string>(19),
                                CustomColumns = dbDataReader.GetValueOrDefault<string>(20),
                                ExternalId = dbDataReader.GetValueOrDefault<string>(21),
                            };
                        }
                    }
                }
            }
            return null;
        }

        private static string SelectClause = "[Id], [SurveyId], [Language], [Credential], [CurrentPageId], [ResponseStatus], [EmailAddress], [NumberSent], [LastTimeSent], [Started], [LastModified], [Completed], [IsMobile], [TouchEvents], [ScreenPixelsWidth], [ScreenPixelsHeight], [UserAgent], [CurrentLoopState], [CurrentGotoStack], [CurrentSkipStack], [CustomColumns], [ExternalId]";

        private SqlCommand CreateCommandWithId(long respondentId, string surveyId, bool isTesting)
        {
            var command = CreateConnection().CreateCommand();
            command.CommandText =
                string.Format("SELECT {0} FROM {1} WHERE Id=@Id AND SurveyId=@SurveyId",
                SelectClause,
                TableName(isTesting));
            command.Parameters.Add(new SqlParameter("@Id", respondentId));
            command.Parameters.Add(new SqlParameter("@SurveyId", surveyId));

            command.CommandType = CommandType.Text;
            return command;
        }

        private SqlCommand CreateCommandWithExternalId(string externalId, string surveyId, bool isTesting)
        {
            var command = new SqlCommand()
            {
                CommandType = CommandType.Text,
                CommandText = string.Format(
                    "SELECT {0} FROM {1} WHERE ExternalId=@ExternalId AND SurveyId=@SurveyId",
                    SelectClause,
                    TableName(isTesting))
            };
            command.Parameters.Add(new SqlParameter("@ExternalId", externalId));
            command.Parameters.Add(new SqlParameter("@SurveyId", surveyId));
            return command;
        }

        public void Add(Respondent respondent, bool isTesting)
        {
            using (var connection = CreateConnection())
            {
                connection.Open();
                using (var command = connection.CreateCommand())
                {
                    command.CommandText =
                        string.Format(@"INSERT INTO {0}
                           ([SurveyId]
                           ,[Language]
                           ,[Credential]
                           ,[EmailAddress]
                           ,[NumberSent]
                           ,[Started]
                           ,[LastModified]
                           ,[Completed]
                           ,[ResponseStatus]
                           ,[IsMobile]
                           ,[ScreenPixelsWidth]
                           ,[ScreenPixelsHeight]
                           ,[TouchEvents]
                           ,[UserAgent]
                           ,[CurrentLoopState]
                           ,[CurrentGotoStack]
                           ,[CurrentSkipStack]
                           ,[ExternalId]
                           ) Values (@SurveyId,
                                @Language,
                                @Credential,
                                @EmailAddress,
                                @NumberSent,
                                @Started,
                                @LastModified,
                                @Completed,
                                @ResponseStatus,
                                @IsMobile,
                                @ScreenPixelsWidth,
                                @ScreenPixelsHeight,
                                @TouchEvents,
                                @UserAgent,
                                @CurrentLoopState,
                                @CurrentGotoStack,
                                @CurrentSkipStack,
                                @ExternalId)
                           SELECT @@identity;", TableName(isTesting));
                    command.Parameters.Add(new SqlParameter("@SurveyId", respondent.SurveyId));
                    command.Parameters.Add(new SqlParameter("@Language", respondent.Language ?? SqlString.Null));
                    command.Parameters.Add(new SqlParameter("@Credential", respondent.Credential));
                    command.Parameters.Add(new SqlParameter("@EmailAddress", respondent.EmailAddress));
                    command.Parameters.Add(new SqlParameter("@NumberSent", respondent.NumberSent));
                    command.Parameters.Add(new SqlParameter("@Started", respondent.Started ?? SqlDateTime.Null));
                    command.Parameters.Add(new SqlParameter("@LastModified", respondent.LastModified ?? SqlDateTime.Null));
                    command.Parameters.Add(new SqlParameter("@Completed", respondent.Completed ?? SqlDateTime.Null));
                    command.Parameters.Add(new SqlParameter("@ResponseStatus", GetStatusString(respondent)));
                    command.Parameters.Add(new SqlParameter("@IsMobile", respondent.IsMobile));
                    command.Parameters.Add(new SqlParameter("@ScreenPixelsWidth", respondent.ScreenPixelsWidth));
                    command.Parameters.Add(new SqlParameter("@ScreenPixelsHeight", respondent.ScreenPixelsHeight));
                    command.Parameters.Add(new SqlParameter("@TouchEvents", respondent.TouchEvents ?? string.Empty));
                    command.Parameters.Add(new SqlParameter("@UserAgent", respondent.UserAgent ?? string.Empty));
                    command.Parameters.Add(new SqlParameter("@CurrentLoopState", respondent.CurrentLoopState ?? string.Empty));
                    command.Parameters.Add(new SqlParameter("@CurrentGotoStack", respondent.CurrentGotoStack ?? string.Empty));
                    command.Parameters.Add(new SqlParameter("@CurrentSkipStack", respondent.CurrentSkipStack?? string.Empty));
                    command.Parameters.Add(new SqlParameter("@ExternalId", respondent.ExternalId ?? string.Empty));

                    command.CommandType = CommandType.Text;
                    respondent.Id = (long)((decimal)command.ExecuteScalar());
                }
            }
        }

        private static SqlString GetStatusString(Respondent respondent)
        {
            ResponseStatus statusCode = respondent.ResponseStatusCode;
            return statusCode == ResponseStatus.Custom ? respondent.ResponseStatus : statusCode.ToString();
        }

        public void Update(Respondent respondent, bool isTesting)
        {
            using (var connection = CreateConnection())
            {
                connection.Open();
                using (var command = connection.CreateCommand())
                {
                    command.CommandText = string.Format(
                        @"UPDATE {0} SET
                            CurrentPageId=@CurrentPageId,
                            NumberSent=@NumberSent,
                            Started=@Started,
                            LastModified=@LastModified,
                            Completed=@Completed,
                            ResponseStatus=@ResponseStatus,
                            IsMobile=@IsMobile,
                            TouchEvents=@TouchEvents,
                            ScreenPixelsWidth=@ScreenPixelsWidth,
                            ScreenPixelsHeight=@ScreenPixelsHeight,
                            UserAgent=@UserAgent,
                            CurrentLoopState=@CurrentLoopState,
                            CurrentGotoStack=@CurrentGotoStack,
                            CurrentSkipStack=@CurrentSkipStack,
                            EmailAddress=@EmailAddress,
                            Language=@Language,
                            ExternalId=@ExternalId
                          WHERE Id=@Id", TableName(isTesting));
                    command.Parameters.Add(new SqlParameter("@CurrentPageId",respondent.CurrentPageId ?? SqlString.Null));
                    command.Parameters.Add(new SqlParameter("@NumberSent", respondent.NumberSent));
                    command.Parameters.Add(new SqlParameter("@Started", respondent.Started ?? SqlDateTime.Null));
                    command.Parameters.Add(new SqlParameter("@LastModified", respondent.LastModified ?? SqlDateTime.Null));
                    command.Parameters.Add(new SqlParameter("@Completed", respondent.Completed ?? SqlDateTime.Null));
                    command.Parameters.Add(new SqlParameter("@ResponseStatus", GetStatusString(respondent)));
                    command.Parameters.Add(new SqlParameter("@IsMobile", respondent.IsMobile));
                    command.Parameters.Add(new SqlParameter("@ScreenPixelsWidth", respondent.ScreenPixelsWidth));
                    command.Parameters.Add(new SqlParameter("@ScreenPixelsHeight", respondent.ScreenPixelsHeight));
                    command.Parameters.Add(new SqlParameter("@TouchEvents", respondent.TouchEvents ?? string.Empty));
                    command.Parameters.Add(new SqlParameter("@UserAgent", respondent.UserAgent ?? string.Empty));
                    command.Parameters.Add(new SqlParameter("@Id", respondent.Id));
                    command.Parameters.Add(new SqlParameter("@CurrentLoopState", respondent.CurrentLoopState));
                    command.Parameters.Add(new SqlParameter("@CurrentGotoStack", respondent.CurrentGotoStack));
                    command.Parameters.Add(new SqlParameter("@CurrentSkipStack", respondent.CurrentSkipStack));
                    command.Parameters.Add(new SqlParameter("@EmailAddress", respondent.EmailAddress));
                    command.Parameters.Add(new SqlParameter("@Language", respondent.Language));
                    command.Parameters.Add(new SqlParameter("@ExternalId", respondent.ExternalId ?? SqlString.Null));

                    command.CommandType = CommandType.Text;
                    command.ExecuteNonQuery();
                }
            }
        }

        public IList<Respondent> GetAll(string surveyId)
        {
            throw new InvalidOperationException("This method only works in the memory repository");
        }
    }
}