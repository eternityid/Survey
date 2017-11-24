using System.Data.Entity;

namespace LearningPlatform.Data.EntityFramework.ResponsesDb
{
    internal class ResponsesContextInitializer : MigrateDatabaseToLatestVersion<ResponsesContext, ResponsesContextConfiguration>
    {
    }
}