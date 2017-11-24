using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.ResponsesDb.Migrations
{
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateRespondentsTable("dbo.Respondents");
            CreateAnswersTable("dbo.Answers");

            CreateRespondentsTable("dbo.TestRespondents");
            CreateAnswersTable("dbo.TestAnswers");
        }

        private void CreateRespondentsTable(string tableName)
        {
            CreateTable(tableName,
                c => new
                {
                    Id = c.Long(nullable: false, identity: true),
                    Language = c.String(),
                    Credential = c.String(maxLength: 10),
                    SurveyId = c.Long(nullable: false),
                    CurrentPageId = c.Long(),
                    CurrentLoopState = c.String(),
                    CurrentGotoStack = c.String(),
                    CurrentSkipStack = c.String(),
                    EmailAddress = c.String(),
                    NumberSent = c.Int(nullable: false),
                    LastTimeSent = c.DateTime(),
                    Started = c.DateTime(),
                    LastModified = c.DateTime(),
                    Completed = c.DateTime(),
                    ResponseStatus = c.String(nullable: false, maxLength: 30),
                    IsMobile = c.Boolean(nullable: false),
                    ScreenPixelsHeight = c.Int(nullable: false),
                    ScreenPixelsWidth = c.Int(nullable: false),
                    TouchEvents = c.String(),
                    UserAgent = c.String(),
                })
                .PrimaryKey(t => t.Id);
        }

        private void CreateAnswersTable(string tableName)
        {
            CreateTable(tableName,
                c => new
                {
                    Id = c.Long(nullable: false, identity: true),
                    SurveyId = c.Long(nullable: false),
                    RespondentId = c.Long(nullable: false),
                    Alias = c.String(maxLength: 30, unicode: false),
                    QuestionName = c.String(nullable: false, maxLength: 100, unicode: false),
                    AnswerType = c.Short(nullable: false),
                    IntegerAnswer = c.Int(),
                    TextAnswer = c.String(),
                    DateTimeAnswer = c.DateTime(),
                    DoubleAnswer = c.Double(),
                    LoopState = c.String(maxLength: 255),
                })
                .PrimaryKey(t => t.Id);
        }

        public override void Down()
        {
            DropTable("dbo.Answers");
            DropTable("dbo.Respondents");

            DropTable("dbo.TestAnswers");
            DropTable("dbo.TestRespondents");
        }
    }
}
