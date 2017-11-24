using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class RemovePictureSelection : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Questions", "IsPictureSelection");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Questions", "IsPictureSelection", c => c.Boolean());
        }
    }
}
