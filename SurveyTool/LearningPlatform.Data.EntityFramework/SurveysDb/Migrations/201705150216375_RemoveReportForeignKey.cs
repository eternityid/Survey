namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class RemoveReportForeignKey : DbMigration
    {
        public override void Up()
        {
            Sql("ALTER TABLE [dbo].[Reports] DROP CONSTRAINT [FK_dbo.Reports_dbo.Surveys_SurveyId]");
        }

        public override void Down()
        {
        }
    }
}
