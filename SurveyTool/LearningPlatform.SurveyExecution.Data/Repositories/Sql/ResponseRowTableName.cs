namespace LearningPlatform.SurveyExecution.Data.Repositories.Sql
{
    public static class ResponseRowTableName
    {
        public static string TableName(bool isTesting)
        {
            return isTesting ? "TestAnswers" : "Answers";
        }

    }
}