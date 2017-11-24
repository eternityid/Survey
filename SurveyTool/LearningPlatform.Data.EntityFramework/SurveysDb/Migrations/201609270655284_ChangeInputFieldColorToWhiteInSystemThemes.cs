using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class ChangeInputFieldColorToWhiteInSystemThemes : DbMigration
    {
        public override void Up()
        {
            Sql(@"UPDATE [dbo].[Themes]
                  SET [InputFieldColor] = '#FFFFFF'
                  WHERE [Id] in (1,2,3,5)");
        }

        public override void Down()
        {
        }
    }
}
