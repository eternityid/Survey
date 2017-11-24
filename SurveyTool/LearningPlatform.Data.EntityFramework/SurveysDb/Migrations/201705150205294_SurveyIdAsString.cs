using System.Collections.Generic;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class SurveyIdAsString : DbMigrationExtended
    {
        public override void Up()
        {
            ConvertIdColumn("dbo.Surveys", new[]
            {
                new KeyValuePair<string, string>("dbo.Nodes", "SurveyId"),
                new KeyValuePair<string, string>("dbo.OptionLists", "SurveyId"),
                new KeyValuePair<string, string>("dbo.LanguageStrings", "SurveyId"),
                new KeyValuePair<string, string>("dbo.Questions", "SurveyId"),
                new KeyValuePair<string, string>("dbo.SkipCommands", "SurveyId"),
                new KeyValuePair<string, string>("dbo.Expressions", "SurveyId"),
                new KeyValuePair<string, string>("dbo.Reports", "SurveyId"),
                new KeyValuePair<string, string>("dbo.SurveyVersions", "SurveyId")
            });

            AlterColumn("dbo.Resources", "SurveyId", c => c.String());

            //DropIndex("dbo.Nodes", new[] { "SurveyId" });
            //DropIndex("dbo.OptionLists", new[] { "SurveyId" });
            //DropIndex("dbo.LanguageStrings", new[] { "SurveyId" });
            //DropIndex("dbo.Questions", new[] { "SurveyId" });
            //DropIndex("dbo.SkipCommands", new[] { "SurveyId" });
            //DropIndex("dbo.Expressions", new[] { "SurveyId" });
            //DropIndex("dbo.Reports", new[] { "SurveyId" });
            //DropIndex("dbo.SurveyVersions", new[] { "SurveyId" });
            //DropPrimaryKey("dbo.Surveys");
            //AlterColumn("dbo.Nodes", "SurveyId", c => c.String());
            //AlterColumn("dbo.OptionLists", "SurveyId", c => c.String());
            //AlterColumn("dbo.LanguageStrings", "SurveyId", c => c.String(nullable: false));
            //AlterColumn("dbo.Questions", "SurveyId", c => c.String(nullable: false));
            //AlterColumn("dbo.SkipCommands", "SurveyId", c => c.String());
            //AlterColumn("dbo.Expressions", "SurveyId", c => c.String());
            //AlterColumn("dbo.Reports", "SurveyId", c => c.String(nullable: false));
            //AlterColumn("dbo.Resources", "SurveyId", c => c.String());
            //AlterColumn("dbo.Surveys", "Id", c => c.String(nullable: false, maxLength: 128));
            //AlterColumn("dbo.SurveyVersions", "SurveyId", c => c.String());
            //AddPrimaryKey("dbo.Surveys", "Id");
            //CreateIndex("dbo.Nodes", "SurveyId");
            //CreateIndex("dbo.OptionLists", "SurveyId");
            //CreateIndex("dbo.LanguageStrings", "SurveyId");
            //CreateIndex("dbo.Questions", "SurveyId");
            //CreateIndex("dbo.SkipCommands", "SurveyId");
            //CreateIndex("dbo.Expressions", "SurveyId");
            //CreateIndex("dbo.Reports", "SurveyId");
            //CreateIndex("dbo.SurveyVersions", "SurveyId");
        }

        public override void Down()
        {
            //DropIndex("dbo.SurveyVersions", new[] { "SurveyId" });
            //DropIndex("dbo.Reports", new[] { "SurveyId" });
            //DropIndex("dbo.Expressions", new[] { "SurveyId" });
            //DropIndex("dbo.SkipCommands", new[] { "SurveyId" });
            //DropIndex("dbo.Questions", new[] { "SurveyId" });
            //DropIndex("dbo.LanguageStrings", new[] { "SurveyId" });
            //DropIndex("dbo.OptionLists", new[] { "SurveyId" });
            //DropIndex("dbo.Nodes", new[] { "SurveyId" });
            //DropPrimaryKey("dbo.Surveys");
            //AlterColumn("dbo.SurveyVersions", "SurveyId", c => c.Long(nullable: false));
            //AlterColumn("dbo.Surveys", "Id", c => c.Long(nullable: false, identity: true));
            //AlterColumn("dbo.Resources", "SurveyId", c => c.Long());
            //AlterColumn("dbo.Reports", "SurveyId", c => c.Long(nullable: false));
            //AlterColumn("dbo.Expressions", "SurveyId", c => c.Long(nullable: false));
            //AlterColumn("dbo.SkipCommands", "SurveyId", c => c.Long(nullable: false));
            //AlterColumn("dbo.Questions", "SurveyId", c => c.Long(nullable: false));
            //AlterColumn("dbo.LanguageStrings", "SurveyId", c => c.Long(nullable: false));
            //AlterColumn("dbo.OptionLists", "SurveyId", c => c.Long(nullable: false));
            //AlterColumn("dbo.Nodes", "SurveyId", c => c.Long(nullable: false));
            //AddPrimaryKey("dbo.Surveys", "Id");
            //CreateIndex("dbo.SurveyVersions", "SurveyId");
            //CreateIndex("dbo.Reports", "SurveyId");
            //CreateIndex("dbo.Expressions", "SurveyId");
            //CreateIndex("dbo.SkipCommands", "SurveyId");
            //CreateIndex("dbo.Questions", "SurveyId");
            //CreateIndex("dbo.LanguageStrings", "SurveyId");
            //CreateIndex("dbo.OptionLists", "SurveyId");
            //CreateIndex("dbo.Nodes", "SurveyId");
        }
    }
}
