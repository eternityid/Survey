namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class SetNullableForColumnWidthResultElement : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.ReportElements", "ColumnWidth", c => c.Int());
        }

        public override void Down()
        {
            AlterColumn("dbo.ReportElements", "ColumnWidth", c => c.Int(nullable: false));
        }
    }
}
