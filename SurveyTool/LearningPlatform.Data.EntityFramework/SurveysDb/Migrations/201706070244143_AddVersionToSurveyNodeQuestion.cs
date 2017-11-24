namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class AddVersionToSurveyNodeQuestion : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Nodes", "Version", c => c.String());
            AddColumn("dbo.Questions", "Version", c => c.String());
            AddColumn("dbo.Surveys", "Version", c => c.String());
            AddColumn("dbo.SurveySettings", "Version", c => c.String());
        }

        public override void Down()
        {
            DropColumn("dbo.SurveySettings", "Version");
            DropColumn("dbo.Surveys", "Version");
            DropColumn("dbo.Questions", "Version");
            DropColumn("dbo.Nodes", "Version");
        }
    }
}
