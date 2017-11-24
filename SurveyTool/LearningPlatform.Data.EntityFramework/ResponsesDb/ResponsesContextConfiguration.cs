using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.ResponsesDb
{
    /*
    Add-Migration -StartUpProjectName LearningPlatform.Api -ProjectName LearningPlatform.Data.EntityFramework -configuration LearningPlatform.Data.EntityFramework.ResponsesDb.ResponsesContextConfiguration __NameOfMigrationStep__
    Update-Database -StartUpProjectName LearningPlatform.Api -ProjectName LearningPlatform.Data.EntityFramework -configuration LearningPlatform.Data.EntityFramework.ResponsesDb.ResponsesContextConfiguration
    */

    // !!!!!!!!!!!!!!!
    // Note! The Add-Migration will only create db changes for production mode tables (Respondents and Answers). You need to manually edit these files
    // to add the same steps for test tables (TestRespondents and TestAnswers)
    // !!!!!!!!!!!!!!!

    internal sealed class ResponsesContextConfiguration : DbMigrationsConfiguration<ResponsesContext>
    {
        public ResponsesContextConfiguration()
        {
            AutomaticMigrationsEnabled = false;
            MigrationsDirectory = @"ResponsesDb\Migrations";
            MigrationsNamespace = "LearningPlatform.Data.EntityFramework.ResponsesDb.Migrations";
            ContextKey = "LearningPlatform.Data.ResponsesDb.ResponsesContextConfiguration";
        }

        protected override void Seed(ResponsesContext context)
        {

        }
    }
}
