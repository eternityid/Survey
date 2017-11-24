namespace LearningPlatform.Data.EntityFramework.ResponsesDb.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class UpdateAnswersTypeWithSurveyIdAsString : DbMigration
    {
        public override void Up()
        {
            Sql(@"DROP TYPE [dbo].[AnswersType]");
            Sql(@"CREATE TYPE [dbo].[AnswersType] AS TABLE(
            	[SurveyId] [varchar](24) NOT NULL,
            	[RespondentId] [bigint] NOT NULL,
            	[QuestionName] [nvarchar](100) NOT NULL,
            	[AnswerType] [smallint] NOT NULL,
            	[Alias] [varchar](30) NULL,
            	[IntegerAnswer] [int] NULL,
            	[DateTimeAnswer] [datetime] NULL,
            	[TextAnswer] [nvarchar](max) NULL,
            	[DoubleAnswer] [float] NULL,
                [LoopState] [nvarchar](255) NULL
            )");
        }

        public override void Down()
        {
            Sql(@"DROP TYPE [dbo].[AnswersType]");
            Sql(@"CREATE TYPE [dbo].[AnswersType] AS TABLE(
            	[SurveyId] [bigint] NOT NULL,
            	[RespondentId] [bigint] NOT NULL,
            	[QuestionName] [nvarchar](100) NOT NULL,
            	[AnswerType] [smallint] NOT NULL,
            	[Alias] [varchar](30) NULL,
            	[IntegerAnswer] [int] NULL,
            	[DateTimeAnswer] [datetime] NULL,
            	[TextAnswer] [nvarchar](max) NULL,
            	[DoubleAnswer] [float] NULL,
                [LoopState] [nvarchar](255) NULL
            )");

        }
    }
}
