using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class SetDefaultErrorColorAndBackgroundColorAndInputFieldBackgroundForFiveDefaultThemes : DbMigration
    {
        public override void Up()
        {
            Sql(@"UPDATE [dbo].[Themes]
                  SET [ErrorColor] = '#FFFFFF', [ErrorBackgroundColor] = '#D65769', [InputFieldBackgroundColor]='transparent'
                  WHERE [Id] = 1 AND [Name] = 'Green'");

            Sql(@"UPDATE [dbo].[Themes]
                  SET [ErrorColor] = '#333333', [ErrorBackgroundColor] = '#F3E47D', [InputFieldBackgroundColor]='transparent'
                  WHERE [Id] = 2 AND [Name] = 'Red'");

            Sql(@"UPDATE [dbo].[Themes]
                  SET [ErrorColor] = '#FFFFFF', [ErrorBackgroundColor] = '#FF6868', [InputFieldBackgroundColor]='transparent'
                  WHERE [Id] = 3 AND [Name] = 'Blue'");

            Sql(@"UPDATE [dbo].[Themes]
                  SET [ErrorColor] = '#FFFFFF', [ErrorBackgroundColor] = '#FF6868', [InputFieldBackgroundColor]='transparent'
                  WHERE [Id] = 4 AND [Name] = 'White'");

            Sql(@"UPDATE [dbo].[Themes]
                  SET [ErrorColor] = '#FFFFFF', [ErrorBackgroundColor] = '#FF6868', [InputFieldBackgroundColor]='transparent'
                  WHERE [Id] = 5 AND [Name] = 'Black'");

        }

        public override void Down()
        {
        }
    }
}
