using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class ChangeUserId : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Reports", "UserId", c => c.String(maxLength: 36, unicode: false));
            AlterColumn("dbo.Surveys", "UserId", c => c.String(maxLength: 36, unicode: false));
            CreateIndex("dbo.Reports", "UserId");
            CreateIndex("dbo.Surveys", "UserId");
        }
        
        public override void Down()
        {
            DropIndex("dbo.Surveys", new[] { "UserId" });
            DropIndex("dbo.Reports", new[] { "UserId" });
            AlterColumn("dbo.Surveys", "UserId", c => c.String());
            AlterColumn("dbo.Reports", "UserId", c => c.String());
        }
    }
}
