namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddTemplates : DbMigration
    {
        public override void Up()
        {
            Sql(@"
IF NOT EXISTS (SELECT TOP 1 * FROM [dbo].[Templates])
BEGIN
SET IDENTITY_INSERT [dbo].[Templates] ON 


INSERT [dbo].[Templates] ([Id], [Name], [IsDefault], [LayoutId], [Discriminator], [Content]) VALUES (1, NULL, 1, 1, N'BodyTemplate', N'<div>
   <div class=""row"">
       @page
   </div><!--row-->
</div> <!--body-content-->
@surveyProgress')

INSERT [dbo].[Templates] ([Id], [Name], [IsDefault], [LayoutId], [Discriminator], [Content]) VALUES (2, NULL, 1, 1, N'PageTemplate', N'
@pageErrorArea
@questions
@navigation')

INSERT [dbo].[Templates] ([Id], [Name], [IsDefault], [LayoutId], [Discriminator], [Content]) VALUES (3, NULL, 1, 1, N'PageErrorAreaTemplate', N'@pageErrors')

INSERT [dbo].[Templates] ([Id], [Name], [IsDefault], [LayoutId], [Discriminator], [Content]) VALUES (4, NULL, 1, 1, N'PageErrorTemplate', N'
<div class=""alert alert-warning"" role=""alert"">
@error
</div>')

INSERT [dbo].[Templates] ([Id], [Name], [IsDefault], [LayoutId], [Discriminator], [Content]) VALUES (5, NULL, 1, 1, N'QuestionErrorAreaTemplate', N'
<div class=""alert alert-info"" role=""alert"">
@questionErrors
</div> <!!--errors-->')

INSERT [dbo].[Templates] ([Id], [Name], [IsDefault], [LayoutId], [Discriminator], [Content]) VALUES (6, NULL, 1, 1, N'QuestionErrorTemplate', N'
<p>
@error
</p>')

INSERT [dbo].[Templates] ([Id], [Name], [IsDefault], [LayoutId], [Discriminator], [Content]) VALUES (7, NULL, 1, 1, N'QuestionTemplate', N'
<div>
    @questionErrorArea
</div>
<div class=''question''>
    <div class=''question-title''>
        @questionTitle
    </div>
    @questionDescription
    <div class=""inputArea"">
        @userInputArea
    </div>  <!--inputArea--> 
</div>')

INSERT [dbo].[Templates] ([Id], [Name], [IsDefault], [LayoutId], [Discriminator], [Content]) VALUES (8, NULL, 1, 1, N'OtherQuestionTemplate', N'@userInputArea')

INSERT [dbo].[Templates] ([Id], [Name], [IsDefault], [LayoutId], [Discriminator], [Content]) VALUES (9, NULL, 1, 1, N'SurveyProgressTemplate', N'
<div class=""row"">
    <label class=""progress-label question-title"">Survey Progress</label>
    <div class=""progress"">
        <div class=""progress-bar"" role=""progressbar"" aria-valuenow=""60"" aria-valuemin=""0"" aria-valuemax=""100"" style=""min-width: 2em; width: @progress%;"">
           @progress%
        </div>
    </div>
</div>')

INSERT [dbo].[Templates] ([Id], [Name], [IsDefault], [LayoutId], [Discriminator], [Content]) VALUES (10, NULL, 1, 2, N'BodyTemplate', N'<div class=""data-container"">
                            <div class=""data-content""></div>
                            <div class=""row"">
                               @page
                           </div><!--row-->
                           @surveyProgress
                        </div> <!--body-content-->')

INSERT [dbo].[Templates] ([Id], [Name], [IsDefault], [LayoutId], [Discriminator], [Content]) VALUES (11, NULL, 1, 2, N'PageTemplate', N'
                        @pageErrorArea
                        @questions
                        @navigation')

INSERT [dbo].[Templates] ([Id], [Name], [IsDefault], [LayoutId], [Discriminator], [Content]) VALUES (12, NULL, 1, 2, N'PageErrorAreaTemplate', N'@pageErrors')

INSERT [dbo].[Templates] ([Id], [Name], [IsDefault], [LayoutId], [Discriminator], [Content]) VALUES (13, NULL, 1, 2, N'PageErrorTemplate', N'
                        <div class=""alert alert-warning"" role=""alert"">
                            @error
                        </div>')

INSERT [dbo].[Templates] ([Id], [Name], [IsDefault], [LayoutId], [Discriminator], [Content]) VALUES (14, NULL, 1, 2, N'QuestionErrorAreaTemplate', N'
                        <div class=""alert alert-info"" role=""alert"">
                            @questionErrors
                        </div> <!!--errors-->')

INSERT [dbo].[Templates] ([Id], [Name], [IsDefault], [LayoutId], [Discriminator], [Content]) VALUES (15, NULL, 1, 2, N'QuestionErrorTemplate', N'
                        <p>
                            @error
                        </p>')

INSERT [dbo].[Templates] ([Id], [Name], [IsDefault], [LayoutId], [Discriminator], [Content]) VALUES (16, NULL, 1, 2, N'QuestionTemplate', N'
                        <div>
                            @questionErrorArea
                        </div>
                        <div class=""question"">
                            <div class=""question-title"">
                                @questionTitle
                            </div>
                            @questionDescription
                            <div class=""inputArea"">
                                @userInputArea
                            </div>  <!--inputArea-->
                        </div>')

INSERT [dbo].[Templates] ([Id], [Name], [IsDefault], [LayoutId], [Discriminator], [Content]) VALUES (17, NULL, 1, 2, N'OtherQuestionTemplate', N'@userInputArea')

INSERT [dbo].[Templates] ([Id], [Name], [IsDefault], [LayoutId], [Discriminator], [Content]) VALUES (18, NULL, 1, 2, N'SurveyProgressTemplate', N'
                        <div class=""row"">
                            <label class=""progress-label question-title"">Survey Progress</label>
                            <div class=""progress"">
                                <div class=""progress-bar"" role=""progressbar"" aria-valuenow=""60"" aria-valuemin=""0"" aria-valuemax=""100"" style=""min-width: 2em; width: @progress%;"">
                                   @progress%
                                </div>
                            </div>
                        </div>')

SET IDENTITY_INSERT [dbo].[Templates] OFF
END
");
        }
        
        public override void Down()
        {
        }
    }
}
