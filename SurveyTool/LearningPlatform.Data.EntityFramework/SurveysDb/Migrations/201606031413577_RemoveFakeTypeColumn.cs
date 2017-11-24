using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class RemoveFakeTypeColumn : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Questions", "FakeType");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Questions", "FakeType", c => c.String());
        }
    }
}
