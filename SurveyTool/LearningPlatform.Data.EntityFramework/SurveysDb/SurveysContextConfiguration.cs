using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.SurveysDb
{
    /*
    Add-Migration -StartUpProjectName LearningPlatform.Api -ProjectName LearningPlatform.Data.EntityFramework -configuration LearningPlatform.Data.EntityFramework.SurveysDb.SurveysContextConfiguration __NameOfMigrationStep__
    Update-Database -StartUpProjectName LearningPlatform.Api -ProjectName LearningPlatform.Data.EntityFramework -configuration LearningPlatform.Data.EntityFramework.SurveysDb.SurveysContextConfiguration
    */
    public sealed class SurveysContextConfiguration : DbMigrationsConfiguration<SurveysContext>
    {
        public SurveysContextConfiguration()
        {
            AutomaticMigrationsEnabled = false;
            MigrationsDirectory = @"SurveysDb\Migrations";
            MigrationsNamespace = "LearningPlatform.Data.EntityFramework.SurveysDb.Migrations";
            ContextKey = "LearningPlatform.Data.SurveysDb.SurveysContextConfiguration";
        }
    }
}
