using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class SurveyIdIndexOnReportDefinition : DbMigration
    {
        public override void Up()
        {
            CreateIndex("dbo.Reports", "SurveyId");
        }
        
        public override void Down()
        {
            DropIndex("dbo.Reports", new[] { "SurveyId" });
        }
    }
}
