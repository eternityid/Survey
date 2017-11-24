using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.ResponsesDb.Migrations
{
    public partial class ChangeTracking : DbMigration
    {
        private const string EnableChangeTrackingOnTable = @"IF NOT EXISTS (SELECT d.name
            FROM sys.change_tracking_tables t
            INNER JOIN sys.tables d ON d.object_id = t.object_id WHERE d.name ='{0}')
            ALTER TABLE [dbo].[{0}]
            ENABLE CHANGE_TRACKING WITH (TRACK_COLUMNS_UPDATED = ON)";

        private const string DisableChangeTrackingOnTable = @"IF EXISTS (SELECT d.name
            FROM sys.change_tracking_tables t
            INNER JOIN sys.tables d ON d.object_id = t.object_id WHERE d.name ='{0}')
            ALTER TABLE [dbo].[{0}] DISABLE CHANGE_TRACKING";

        public override void Up()
        {
            Sql(@"IF NOT EXISTS (SELECT * 
            FROM sys.change_tracking_databases 
            WHERE database_id=DB_ID())
            ALTER DATABASE Current SET CHANGE_TRACKING = ON", true);

            Sql(string.Format(EnableChangeTrackingOnTable, "Answers"), true);
            Sql(string.Format(EnableChangeTrackingOnTable, "Respondents"), true);

            Sql(string.Format(EnableChangeTrackingOnTable, "TestAnswers"), true);
            Sql(string.Format(EnableChangeTrackingOnTable, "TestRespondents"), true);

        }

        public override void Down()
        {
            Sql(string.Format(DisableChangeTrackingOnTable, "Answers"), true);
            Sql(string.Format(DisableChangeTrackingOnTable, "Respondents"), true);

            Sql(string.Format(DisableChangeTrackingOnTable, "TestAnswers"), true);
            Sql(string.Format(DisableChangeTrackingOnTable, "TestRespondents"), true);

            Sql(@"IF EXISTS (SELECT * 
            FROM sys.change_tracking_databases 
            WHERE database_id=DB_ID())
            ALTER DATABASE Current SET CHANGE_TRACKING = OFF", true);
        }
    }
}
