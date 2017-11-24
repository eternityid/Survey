namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class RemoveLayoutAndTemplates : DbMigration
    {
        public override void Up()
        {
            Sql("UPDATE [dbo].[Surveys] SET [LayoutId]=2 WHERE [LayoutId]=3");
            Sql("TRUNCATE TABLE [dbo].[Templates]");
            Sql("DELETE FROM [dbo].[Layouts] WHERE [Id]=3");
        }

        public override void Down()
        {
        }
    }
}
