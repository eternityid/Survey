using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class AddIndices : DbMigration
    {
        public override void Up()
        {
            CreateIndex("dbo.Nodes", "SurveyId");
            CreateIndex("dbo.OptionLists", "SurveyId");
            CreateIndex("dbo.LanguageStrings", "SurveyId");
            CreateIndex("dbo.Questions", "SurveyId");
            CreateIndex("dbo.SkipCommands", "SurveyId");
            CreateIndex("dbo.Expressions", "SurveyId");
            CreateIndex("dbo.ReportElements", "ReportId");
            CreateIndex("dbo.ReportPages", "ReportId");
            CreateIndex("dbo.SurveyVersions", "SurveyId");
            CreateIndex("dbo.Themes", "Type");
        }
        
        public override void Down()
        {
            DropIndex("dbo.Themes", new[] { "Type" });
            DropIndex("dbo.SurveyVersions", new[] { "SurveyId" });
            DropIndex("dbo.ReportPages", new[] { "ReportId" });
            DropIndex("dbo.ReportElements", new[] { "ReportId" });
            DropIndex("dbo.Expressions", new[] { "SurveyId" });
            DropIndex("dbo.SkipCommands", new[] { "SurveyId" });
            DropIndex("dbo.Questions", new[] { "SurveyId" });
            DropIndex("dbo.LanguageStrings", new[] { "SurveyId" });
            DropIndex("dbo.OptionLists", new[] { "SurveyId" });
            DropIndex("dbo.Nodes", new[] { "SurveyId" });
        }
    }
}
