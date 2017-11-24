namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddBackgroundStyleFieldIntoTheme : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Themes", "BackgroundStyle", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Themes", "BackgroundStyle");
        }
    }
}
