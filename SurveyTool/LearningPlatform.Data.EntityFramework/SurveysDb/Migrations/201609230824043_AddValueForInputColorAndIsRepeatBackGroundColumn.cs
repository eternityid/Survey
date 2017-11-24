using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class AddValueForInputColorAndIsRepeatBackGroundColumn : DbMigration
    {
        public override void Up()
        {
            Sql(@"UPDATE [dbo].[Themes]
                  SET [InputFieldBackgroundColor] = '#FFFFFF', [InputFieldColor]='#333333', [IsRepeatBackground]=1");

            Sql(@"UPDATE [dbo].[Themes]
                  SET [QuestionContentColor] = '#FFFFFF'
                  WHERE [Id] in (1,2,3,5)");
        }

        public override void Down()
        {
        }
    }
}
