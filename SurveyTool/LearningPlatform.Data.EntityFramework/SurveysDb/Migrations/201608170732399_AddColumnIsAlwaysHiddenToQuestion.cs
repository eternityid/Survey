using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class AddColumnIsAlwaysHiddenToQuestion : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Questions", "IsAlwaysHidden", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Questions", "IsAlwaysHidden");
        }
    }
}
