using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class AddCustomColumnsFieldForSurvey : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Surveys", "CustomColumns", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Surveys", "CustomColumns");
        }
    }
}
