namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class MoveSurveyTitleToSurveySettingAndReturnBackTemplateIdWithTypeLong : DbMigration
    {
        public override void Up()
        {
            DropPrimaryKey("dbo.Templates");
            AddColumn("dbo.SurveySettings", "SurveyTitle", c => c.String());
            AlterColumn("dbo.Templates", "Id", c => c.Long(nullable: false, identity: true));
            AddPrimaryKey("dbo.Templates", "Id");
        }

        public override void Down()
        {
            DropPrimaryKey("dbo.Templates");
            AlterColumn("dbo.Templates", "Id", c => c.String(nullable: false, maxLength: 128));
            DropColumn("dbo.SurveySettings", "SurveyTitle");
            AddPrimaryKey("dbo.Templates", "Id");
        }
    }
}
