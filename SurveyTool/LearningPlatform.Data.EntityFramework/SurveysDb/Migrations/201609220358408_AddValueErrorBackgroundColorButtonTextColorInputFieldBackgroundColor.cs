using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class AddValueErrorBackgroundColorButtonTextColorInputFieldBackgroundColor : DbMigration
    {
        public override void Up()
        {
            Sql(@"UPDATE [dbo].[Themes]
                  SET [ErrorBackgroundColor] = '#000000', [PrimaryButtonColor] ='#ffffff',
				  [InputFieldBackgroundColor]='#ffffff', [PrimaryButtonBackgroundColor]='#ff6c6c',
                  [DefaultButtonBackgroundColor] = '#ffffff', [DefaultButtonColor] = '#000000',
                  [IsFixBackground] = 0");

            Sql(@"UPDATE [dbo].[Themes]
                  SET [ErrorBackgroundColor] = '#d65769', [PrimaryButtonColor] ='#ffffff',
				  [InputFieldBackgroundColor]='transparent', [PrimaryButtonBackgroundColor]='#085f64',
                  [DefaultButtonBackgroundColor] = '#ffffff', [DefaultButtonColor] = '#000000'
                  WHERE [Id] = '1' AND [Name]='Green'");

            Sql(@"UPDATE [dbo].[Themes]
                  SET [ErrorBackgroundColor] = '#f3e47d', [PrimaryButtonColor] ='#ffffff',
				  [InputFieldBackgroundColor]='#ffffff', [PrimaryButtonBackgroundColor]='#F1982F',
                  [DefaultButtonBackgroundColor] = '#ffffff', [DefaultButtonColor] = '#000000'
                  WHERE [Id] = '2' AND [Name]='Red'");

            Sql(@"UPDATE [dbo].[Themes]
                  SET [ErrorBackgroundColor] = '#ff6868', [PrimaryButtonColor] ='#ffffff',
				  [InputFieldBackgroundColor]='#ffffff', [PrimaryButtonBackgroundColor]='#0075cd',
                  [DefaultButtonBackgroundColor] = '#ffffff', [DefaultButtonColor] = '#000000'
                  WHERE [Id] = '3' AND [Name]='Blue'");

            Sql(@"UPDATE [dbo].[Themes]
                  SET [ErrorBackgroundColor] = '#ff6868', [PrimaryButtonColor] ='#ffffff',
				  [InputFieldBackgroundColor]='#ffffff', [PrimaryButtonBackgroundColor]='#71a5cc',
                  [DefaultButtonBackgroundColor] = '#ffffff', [DefaultButtonColor] = '#000000'
                  WHERE [Id] = '4' AND [Name]='White'");

            Sql(@"UPDATE [dbo].[Themes]
                  SET [ErrorBackgroundColor] = '#f3e47d', [PrimaryButtonColor] ='#ffffff',
				  [InputFieldBackgroundColor]='#ffffff', [PrimaryButtonBackgroundColor]='#ff6c6c',
                  [DefaultButtonBackgroundColor] = '#ffffff', [DefaultButtonColor] = '#000000'
                  WHERE [Id] = '5' AND [Name]='Black'");
        }

        public override void Down()
        {
        }
    }
}
