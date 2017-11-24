using System.Data.Entity;

namespace LearningPlatform.Data.EntityFramework.SurveysDb
{
    internal class SurveysContextInitializer : MigrateDatabaseToLatestVersion<SurveysContext, SurveysContextConfiguration>
    {
    }
}   