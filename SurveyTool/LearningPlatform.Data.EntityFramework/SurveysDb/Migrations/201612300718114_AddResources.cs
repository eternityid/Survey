namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddResources : DbMigration
    {
        public override void Up()
        {
            Sql(@"
IF NOT EXISTS (SELECT TOP 1 * FROM [dbo].[Resources])
BEGIN
SET IDENTITY_INSERT [dbo].[Resources] ON 

INSERT [dbo].[Resources] ([Id], [SurveyId], [Name]) VALUES (1, NULL, N'QuestionRequired')

INSERT [dbo].[Resources] ([Id], [SurveyId], [Name]) VALUES (2, NULL, N'InvitationOnly')

INSERT [dbo].[Resources] ([Id], [SurveyId], [Name]) VALUES (3, NULL, N'SurveyNotOpen')

INSERT [dbo].[Resources] ([Id], [SurveyId], [Name]) VALUES (4, NULL, N'DeletedSurvey')

INSERT [dbo].[Resources] ([Id], [SurveyId], [Name]) VALUES (5, NULL, N'ExclusiveViolation')

INSERT [dbo].[Resources] ([Id], [SurveyId], [Name]) VALUES (6, NULL, N'NextButton')

INSERT [dbo].[Resources] ([Id], [SurveyId], [Name]) VALUES (7, NULL, N'PreviousButton')

INSERT [dbo].[Resources] ([Id], [SurveyId], [Name]) VALUES (8, NULL, N'FinishButton')

INSERT [dbo].[Resources] ([Id], [SurveyId], [Name]) VALUES (9, NULL, N'QuestionSelectionMinMax')

INSERT [dbo].[Resources] ([Id], [SurveyId], [Name]) VALUES (10, NULL, N'QuestionSelectionMin')

INSERT [dbo].[Resources] ([Id], [SurveyId], [Name]) VALUES (11, NULL, N'QuestionSelectionMax')

INSERT [dbo].[Resources] ([Id], [SurveyId], [Name]) VALUES (12, NULL, N'QuestionLengthMinMax')

INSERT [dbo].[Resources] ([Id], [SurveyId], [Name]) VALUES (13, NULL, N'QuestionLengthMin')

INSERT [dbo].[Resources] ([Id], [SurveyId], [Name]) VALUES (14, NULL, N'QuestionLengthMax')

INSERT [dbo].[Resources] ([Id], [SurveyId], [Name]) VALUES (15, NULL, N'QuestionWordsAmountMinMax')

INSERT [dbo].[Resources] ([Id], [SurveyId], [Name]) VALUES (16, NULL, N'QuestionWordsAmountMin')

INSERT [dbo].[Resources] ([Id], [SurveyId], [Name]) VALUES (17, NULL, N'QuestionWordsAmountMax')

SET IDENTITY_INSERT [dbo].[Resources] OFF

SET IDENTITY_INSERT [dbo].[ResourceItems] ON 

INSERT [dbo].[ResourceItems] ([Id], [Language], [Text], [ResourceStringId]) VALUES (1, N'en', N'Question ""{0}"" is required', 1)

INSERT [dbo].[ResourceItems] ([Id], [Language], [Text], [ResourceStringId]) VALUES (2, N'en', N'This survey is not available.', 2)

INSERT [dbo].[ResourceItems] ([Id], [Language], [Text], [ResourceStringId]) VALUES (3, N'en', N'This survey is not opened.', 3)

INSERT [dbo].[ResourceItems] ([Id], [Language], [Text], [ResourceStringId]) VALUES (4, N'en', N'The survey no longer exists.', 4)

INSERT [dbo].[ResourceItems] ([Id], [Language], [Text], [ResourceStringId]) VALUES (5, N'en', N'Question ""{0}"" is invalid. Please select only one option when option ""{1}"" is selected.', 5)

INSERT [dbo].[ResourceItems] ([Id], [Language], [Text], [ResourceStringId]) VALUES (6, N'en', N'Next', 6)

INSERT [dbo].[ResourceItems] ([Id], [Language], [Text], [ResourceStringId]) VALUES (7, N'en', N'Previous', 7)

INSERT [dbo].[ResourceItems] ([Id], [Language], [Text], [ResourceStringId]) VALUES (8, N'en', N'Finish', 8)

INSERT [dbo].[ResourceItems] ([Id], [Language], [Text], [ResourceStringId]) VALUES (9, N'en', N'Question ""{0}"" is invalid. Please select at least {1} and no more than {2} options.', 9)

INSERT [dbo].[ResourceItems] ([Id], [Language], [Text], [ResourceStringId]) VALUES (10, N'en', N'Question ""{0}"" is invalid. Please select at least {1} options.', 10)

INSERT [dbo].[ResourceItems] ([Id], [Language], [Text], [ResourceStringId]) VALUES (11, N'en', N'Question ""{0}"" is invalid. Please select no more than {1} options.', 11)

INSERT [dbo].[ResourceItems] ([Id], [Language], [Text], [ResourceStringId]) VALUES (12, N'en', N'Question ""{0}"" is invalid. Please enter at least {1} characters and no more than {2} characters in your answer.', 12)

INSERT [dbo].[ResourceItems] ([Id], [Language], [Text], [ResourceStringId]) VALUES (13, N'en', N'Question ""{0}"" is invalid. Please enter at least {1} characters in your answer.', 13)

INSERT [dbo].[ResourceItems] ([Id], [Language], [Text], [ResourceStringId]) VALUES (14, N'en', N'Question ""{0}"" is invalid. Please enter no more than {1} characters in your answer.', 14)

INSERT [dbo].[ResourceItems] ([Id], [Language], [Text], [ResourceStringId]) VALUES (15, N'en', N'Question ""{0}"" is invalid. Please enter at least {1} words  and no more than {2} words  in your answer.', 15)

INSERT [dbo].[ResourceItems] ([Id], [Language], [Text], [ResourceStringId]) VALUES (16, N'en', N'Question ""{0}"" is invalid. Please enter at least {1} words in your answer.', 16)

INSERT [dbo].[ResourceItems] ([Id], [Language], [Text], [ResourceStringId]) VALUES (17, N'en', N'Question ""{0}"" is invalid. Please enter no more than {1} words  in your answer.', 17)

SET IDENTITY_INSERT [dbo].[ResourceItems] OFF
END
");
        }
        
        public override void Down()
        {
        }
    }
}
