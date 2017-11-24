namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class AddDisplaySummaryTabular : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ReportPages", "IsDisplaySummaryTabular", c => c.Boolean(nullable: false, defaultValue: false));
        }

        public override void Down()
        {
            DropColumn("dbo.ReportPages", "IsDisplaySummaryTabular");
        }
    }
}
