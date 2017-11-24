namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class CheckEnsureSystemThemes : DbMigration
    {
        public override void Up()
        {
            Sql(@"
                     IF NOT EXISTS (SELECT * FROM Themes WHERE [Name]='Green' AND [Type] = 0)
                        BEGIN
                           INSERT INTO Themes
                                ([Name], [Logo], [Font], [BackgroundImage],	[InactiveOpacity], [BackgroundColor],
                                [QuestionTitleColor], [QuestionDescriptionColor], [QuestionContentColor],
                                [PrimaryButtonBackgroundColor],	[ErrorColor], [IsDefault], [Type], [PrimaryButtonColor],
                                [DefaultButtonBackgroundColor],	[DefaultButtonColor], [ErrorBackgroundColor], [InputFieldBackgroundColor],
                                [IsRepeatBackground], [InputFieldColor], [PageContainerBackgroundColor], [PageContainerBackgroundOpacity])
                                VALUES
                                ('Green', 'logo.png', 'Arial', 'background.jpg', 0.4, '#65b8bb',
                                '#ffffff', '#085f64', '#ffffff',
                                '#085f64', '#f73838', 1, 0, '#ffffff',
                                '#ffffff', '#000000', '#7cc2c5', 'transparent',
                                1, '#ffffff', '#ffffff', 0.25)
                        END
                    ELSE
                        BEGIN
                            UPDATE [dbo].[Themes] SET
                            [BackgroundColor] = '#65b8bb',
                            [QuestionTitleColor]='#ffffff', [QuestionDescriptionColor]='#085f64', [QuestionContentColor]='#ffffff',
                            [PrimaryButtonBackgroundColor]='#085f64', [PrimaryButtonColor]='#ffffff',
                            [DefaultButtonBackgroundColor]='#ffffff', [DefaultButtonColor]='#000000',
                            [ErrorBackgroundColor] ='#7cc2c5', [ErrorColor]='#f73838',
                            [InputFieldBackgroundColor]='transparent', [InputFieldColor]='#ffffff',
                            [PageContainerBackgroundColor]='#ffffff', [PageContainerBackgroundOpacity]='0.25'
                            WHERE [Name]='Green' AND  [Type]= 0
                        END
            ");

            Sql(@"
                     IF NOT EXISTS (SELECT * FROM Themes WHERE [Name]='Red' AND [Type] = 0)
                        BEGIN
                           INSERT INTO Themes
                                ([Name], [Logo], [Font], [BackgroundImage],	[InactiveOpacity], [BackgroundColor],
                                [QuestionTitleColor], [QuestionDescriptionColor], [QuestionContentColor],
                                [PrimaryButtonBackgroundColor],	[ErrorColor], [IsDefault], [Type], [PrimaryButtonColor],
                                [DefaultButtonBackgroundColor],	[DefaultButtonColor], [ErrorBackgroundColor], [InputFieldBackgroundColor],
                                [IsRepeatBackground], [InputFieldColor], [PageContainerBackgroundColor], [PageContainerBackgroundOpacity])
                                VALUES
                                ('Red', 'logo.png', 'Georgia', 'background.jpg', 0.4, '#d58080',
                                '#ffffff', '#a93030', '#ffffff',
                                '#f1982f', '#f3e47d', 0, 0,	'#000000',
                                '#ffffff', '#000000', '#db9393', 'transparent',
                                1, '#ffffff', '#ffffff', 0.25)
                        END
                    ELSE
                        BEGIN
                            UPDATE [dbo].[Themes] SET
                                [BackgroundColor] = '#d58080',
                                [QuestionTitleColor]='#ffffff', [QuestionDescriptionColor]='#a93030',[QuestionContentColor]='#ffffff',
                                [PrimaryButtonBackgroundColor]='#f1982f', [PrimaryButtonColor]='#000000',
                                [DefaultButtonBackgroundColor]='#ffffff',[DefaultButtonColor]='#000000',
                                [ErrorBackgroundColor] ='#db9393', [ErrorColor]='#f3e47d',
                                [InputFieldBackgroundColor]='transparent', [InputFieldColor]='#ffffff',
                                [PageContainerBackgroundColor]='#ffffff', [PageContainerBackgroundOpacity]='0.25'
                            WHERE [Name]='Red' AND  [Type]= 0
                        END
            ");

            Sql(@"
                     IF NOT EXISTS (SELECT * FROM Themes WHERE [Name]='Blue' AND [Type] = 0)
                        BEGIN
                           INSERT INTO Themes
                                ([Name], [Logo], [Font], [BackgroundImage],	[InactiveOpacity], [BackgroundColor],
                                [QuestionTitleColor], [QuestionDescriptionColor], [QuestionContentColor],
                                [PrimaryButtonBackgroundColor],	[ErrorColor], [IsDefault], [Type], [PrimaryButtonColor],
                                [DefaultButtonBackgroundColor],	[DefaultButtonColor], [ErrorBackgroundColor], [InputFieldBackgroundColor],
                                [IsRepeatBackground], [InputFieldColor], [PageContainerBackgroundColor], [PageContainerBackgroundOpacity])
                                VALUES
                                ('Blue', 'logo.png', 'Helvetica Neue', 'background.jpg', '0.5','#80b6df',
                                '#ffffff', '#0075cd', '#ffffff',
                                '#0075cd', '#f73838', 0, 0, '#ffffff',
                                '#ffffff', '#000000', '#93c1e3', 'transparent',
                                1, '#ffffff', '#ffffff', 0.25)
                        END
                    ELSE
                        BEGIN
                            UPDATE [dbo].[Themes] SET
                                [BackgroundColor] = '#80b6df',
                                [QuestionTitleColor]='#ffffff', [QuestionDescriptionColor]='#0075cd', [QuestionContentColor]='#ffffff',
                                [PrimaryButtonBackgroundColor]='#0075cd', [PrimaryButtonColor]='#ffffff',
                                [DefaultButtonBackgroundColor]='#ffffff', [DefaultButtonColor]='#000000',
                                [ErrorBackgroundColor] ='#93c1e3', [ErrorColor]='#f73838',
                                [InputFieldBackgroundColor]='transparent', [InputFieldColor]='#ffffff',
                                [PageContainerBackgroundColor]='#ffffff', [PageContainerBackgroundOpacity]='0.25'
                            WHERE [Name]='Blue' AND  [Type]= 0
                        END
            ");

            Sql(@"
                     IF NOT EXISTS (SELECT * FROM Themes WHERE [Name]='White' AND [Type] = 0)
                        BEGIN
                           INSERT INTO Themes
                                ([Name], [Logo], [Font], [BackgroundImage],	[InactiveOpacity], [BackgroundColor],
                                [QuestionTitleColor], [QuestionDescriptionColor], [QuestionContentColor],
                                [PrimaryButtonBackgroundColor],	[ErrorColor], [IsDefault], [Type], [PrimaryButtonColor],
                                [DefaultButtonBackgroundColor],	[DefaultButtonColor], [ErrorBackgroundColor], [InputFieldBackgroundColor],
                                [IsRepeatBackground], [InputFieldColor], [PageContainerBackgroundColor], [PageContainerBackgroundOpacity])
                                VALUES
                                ('White', 'logo.png', 'Tahoma', 'background.jpg', 0.5, '#ffffff',
                                '#71a5cc', '#c5c5c5', '#333333',
                                '#71a5cc', '#ff9642', 0, 0,	'#000000',
                                '#ffffff', '#000000', '#777777', 'transparent',
                                1, '#333333', '#ffffff', 1)
                        END
                    ELSE
                        BEGIN
                            UPDATE [dbo].[Themes] SET
                                [BackgroundColor] = '#ffffff',
                                [QuestionTitleColor]='#71a5cc', [QuestionDescriptionColor]='#c5c5c5', [QuestionContentColor]='#333333',
                                [PrimaryButtonBackgroundColor]='#71a5cc', [PrimaryButtonColor]='#000000',
                                [DefaultButtonBackgroundColor]='#ffffff', [DefaultButtonColor]='#000000',
                                [ErrorBackgroundColor] ='#777777', [ErrorColor]='#ff9642',
                                [InputFieldBackgroundColor]='transparent', [InputFieldColor]='#333333',
                                [PageContainerBackgroundColor]='#ffffff', [PageContainerBackgroundOpacity]='1.0'
                            WHERE [Name]='White' AND  [Type]= 0
                        END
            ");

            Sql(@"
                     IF NOT EXISTS (SELECT * FROM Themes WHERE [Name]='Black' AND [Type] = 0)
                        BEGIN
                           INSERT INTO Themes
                                ([Name], [Logo], [Font], [BackgroundImage],	[InactiveOpacity], [BackgroundColor],
                                [QuestionTitleColor], [QuestionDescriptionColor], [QuestionContentColor],
                                [PrimaryButtonBackgroundColor],	[ErrorColor], [IsDefault], [Type], [PrimaryButtonColor],
                                [DefaultButtonBackgroundColor],	[DefaultButtonColor], [ErrorBackgroundColor], [InputFieldBackgroundColor],
                                [IsRepeatBackground], [InputFieldColor], [PageContainerBackgroundColor], [PageContainerBackgroundOpacity])
                                VALUES
                                ('Black', 'logo.png', 'TimesNewRoman', 'background.jpg', 0.3, '#252525',
                                '#ff6c6c', '#7e7e7e', '#ffffff',
                                '#ff6c6c','#f73838', 0, 0, '#000000',
                                '#ffffff', '#000000', '#454545', 'transparent',
                                1, '#ffffff', '#484848', 0.8)
                        END
                    ELSE
                        BEGIN
                            UPDATE [dbo].[Themes] SET
                                [BackgroundColor] = '#252525',
                                [QuestionTitleColor]='#ff6c6c', [QuestionDescriptionColor]='#7e7e7e', [QuestionContentColor]='#ffffff',
                                [PrimaryButtonBackgroundColor]='#ff6c6c', [PrimaryButtonColor]='#000000',
                                [DefaultButtonBackgroundColor]='#ffffff', [DefaultButtonColor]='#000000',
                                [ErrorBackgroundColor] ='#454545', [ErrorColor]='#f73838',
                                [InputFieldBackgroundColor]='transparent', [InputFieldColor]='#ffffff',
                                [PageContainerBackgroundColor]='#484848', [PageContainerBackgroundOpacity]='0.8'
                            WHERE [Name]='Black' AND  [Type]= 0
                        END
            ");
        }

        public override void Down()
        {
        }
    }
}
