namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class RemoveSurveyVersionsForeignKey : DbMigration
    {
        public override void Up()
        {
            Sql("ALTER TABLE [dbo].[SurveyVersions] DROP CONSTRAINT [FK_dbo.SurveyVersions_dbo.Surveys_SurveyId]");
        }

        public override void Down()
        {
        }
    }
}
