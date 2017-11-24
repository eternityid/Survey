namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class AddValueInValidationQuestion : DbMigration
    {
        public override void Up()
        {
            Sql(@"
                SET IDENTITY_INSERT [dbo].[Resources] ON 
                
                INSERT [dbo].[Resources] ([Id], [SurveyId], [Name]) VALUES (18, NULL, N'QuestionNumberMinMax')

                INSERT [dbo].[Resources] ([Id], [SurveyId], [Name]) VALUES (19, NULL, N'QuestionNumberMin')

                INSERT [dbo].[Resources] ([Id], [SurveyId], [Name]) VALUES (20, NULL, N'QuestionNumberMax')

                INSERT [dbo].[Resources] ([Id], [SurveyId], [Name]) VALUES (21, NULL, N'QuestionNumberDecimalPlaces')

                SET IDENTITY_INSERT [dbo].[Resources] OFF

                SET IDENTITY_INSERT [dbo].[ResourceItems] ON 
                
                INSERT [dbo].[ResourceItems] ([Id], [Language], [Text], [ResourceStringId]) VALUES (18, N'en', N'Question ""{0}"" is invalid. Please input at least {1} and no more than {2} value.', 18)

                INSERT [dbo].[ResourceItems] ([Id], [Language], [Text], [ResourceStringId]) VALUES (19, N'en', N'Question ""{0}"" is invalid. Please input at least {1} value.', 19)

                INSERT [dbo].[ResourceItems] ([Id], [Language], [Text], [ResourceStringId]) VALUES (20, N'en', N'Question ""{0}"" is invalid. Please input no more than {1} value.', 20)

                INSERT [dbo].[ResourceItems] ([Id], [Language], [Text], [ResourceStringId]) VALUES (21, N'en', N'Question ""{0}"" is invalid. Please input {1} decimal places correctly for {2} value.', 21)


                SET IDENTITY_INSERT [dbo].[ResourceItems] OFF
            ");
        }

        public override void Down()
        {
        }
    }
}
