namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class AddColumnWidthForReport : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ReportElements", "ColumnWidth", c => c.Int(nullable: false, defaultValue: 50));
        }

        public override void Down()
        {
            DropColumn("dbo.ReportElements", "ColumnWidth");
        }
    }
}
