using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class ExclusiveAndNAOptions : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Options", "IsExclusive", c => c.Boolean(nullable: false));
            AddColumn("dbo.Options", "IsNotApplicable", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Options", "IsNotApplicable");
            DropColumn("dbo.Options", "IsExclusive");
        }
    }
}
