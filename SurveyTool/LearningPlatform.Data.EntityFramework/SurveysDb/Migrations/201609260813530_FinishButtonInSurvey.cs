using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class FinishButtonInSurvey : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.SurveySettings", "FinishButtonTextId", c => c.Long());
            CreateIndex("dbo.SurveySettings", "FinishButtonTextId");
            AddForeignKey("dbo.SurveySettings", "FinishButtonTextId", "dbo.LanguageStrings", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.SurveySettings", "FinishButtonTextId", "dbo.LanguageStrings");
            DropIndex("dbo.SurveySettings", new[] { "FinishButtonTextId" });
            DropColumn("dbo.SurveySettings", "FinishButtonTextId");
        }
    }
}
