namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class UpdateDiscriminatorAndRemoveUnusedElementForReportElement : DbMigration
    {
        public override void Up()
        {
            Sql(@"UPDATE [dbo].[ReportElements] 
                SET Discriminator = 'ResultElement' 
                FROM ReportElements RE INNER JOIN Reports R on R.Id = RE.ReportId 
                WHERE R.Type = 2");
        }

        public override void Down()
        {
        }
    }
}
