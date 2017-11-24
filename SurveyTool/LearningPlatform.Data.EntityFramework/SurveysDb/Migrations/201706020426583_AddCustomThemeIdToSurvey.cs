namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class AddCustomThemeIdToSurvey : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Surveys", "CustomThemeId", c => c.String());
        }

        public override void Down()
        {
            DropColumn("dbo.Surveys", "CustomThemeId");
        }
    }
}
