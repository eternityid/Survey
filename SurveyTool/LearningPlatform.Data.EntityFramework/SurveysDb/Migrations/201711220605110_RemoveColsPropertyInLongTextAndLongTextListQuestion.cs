namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RemoveColsPropertyInLongTextAndLongTextListQuestion : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Questions", "Cols");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Questions", "Cols", c => c.Int());
        }
    }
}
