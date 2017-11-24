using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class NodeAliasAndTitleDescriptionForPage : DbMigration
    {
        public override void Up()
        {

            RenameColumn("dbo.Nodes", "Name", "Alias");
            RenameColumn("dbo.SurveySettings", "ShowRequiredStar", "DisplayRequiredStar");
            AddColumn("dbo.Nodes", "DecriptionId", c => c.Long());
            AddColumn("dbo.Nodes", "TitleId", c => c.Long());        
            AddColumn("dbo.SurveySettings", "DisplayPageTitleAndDescription", c => c.Boolean(nullable: false));
            CreateIndex("dbo.Nodes", "DecriptionId");
            CreateIndex("dbo.Nodes", "TitleId");
            AddForeignKey("dbo.Nodes", "DecriptionId", "dbo.LanguageStrings", "Id");
            AddForeignKey("dbo.Nodes", "TitleId", "dbo.LanguageStrings", "Id");
            DropColumn("dbo.Nodes", "Description");
        }
        
        public override void Down()
        {
            RenameColumn("dbo.Nodes", "Alias", "Name");
            RenameColumn("dbo.SurveySettings", "DisplayRequiredStar", "ShowRequiredStar");
            AddColumn("dbo.Nodes", "Description", c => c.String());
            DropForeignKey("dbo.Nodes", "TitleId", "dbo.LanguageStrings");
            DropForeignKey("dbo.Nodes", "DecriptionId", "dbo.LanguageStrings");
            DropIndex("dbo.Nodes", new[] { "TitleId" });
            DropIndex("dbo.Nodes", new[] { "DecriptionId" });
            DropColumn("dbo.SurveySettings", "DisplayPageTitleAndDescription");
            DropColumn("dbo.Nodes", "TitleId");
            DropColumn("dbo.Nodes", "DecriptionId");
        }
    }
}
