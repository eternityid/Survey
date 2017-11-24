namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class UpdatePageContainerOpacityType : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Themes", "PageContainerBackgroundOpacity", c => c.Single());
        }

        public override void Down()
        {
            AlterColumn("dbo.Themes", "PageContainerBackgroundOpacity", c => c.Single(nullable: false));
        }
    }
}
