using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.ResponsesDb.Migrations
{
    public partial class AnswersType : DbMigration
    {
        public override void Up()
        {
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

        public override void Down()
        {
            Sql(@"IF EXISTS (SELECT * FROM sys.types WHERE is_table_type = 1 AND name = 'AnswersType')
                DROP TYPE [dbo].[AnswersType]");
        }
    }
}
