namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class AddLibraryIdToSurveyPageQuestion : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Nodes", "LibraryId", c => c.String());
            AddColumn("dbo.Questions", "LibraryId", c => c.String());
            AddColumn("dbo.Surveys", "LibraryId", c => c.String());
        }

        public override void Down()
        {
            DropColumn("dbo.Surveys", "LibraryId");
            DropColumn("dbo.Questions", "LibraryId");
            DropColumn("dbo.Nodes", "LibraryId");
        }
    }
}
