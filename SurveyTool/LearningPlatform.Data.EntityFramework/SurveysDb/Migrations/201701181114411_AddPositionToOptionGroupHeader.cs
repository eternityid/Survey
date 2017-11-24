namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddPositionToOptionGroupHeader : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.OptionGroups", "Position", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.OptionGroups", "Position");
        }
    }
}
