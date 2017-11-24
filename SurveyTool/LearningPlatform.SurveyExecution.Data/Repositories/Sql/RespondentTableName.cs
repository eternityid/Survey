namespace LearningPlatform.SurveyExecution.Data.Repositories.Sql
{
    public static class RespondentTableName
    {
        public static string TableName(bool isTesting)
        {
            return isTesting ? "TestRespondents" : "Respondents";
        }

    }
}