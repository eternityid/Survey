using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class ConvertOpenEndedTextQuestion : DbMigration
    {
        public override void Up()
        {
            Sql(@"UPDATE [dbo].[Questions]
                  SET [Discriminator] = 'OpenEndedShortTextQuestionDefinition'
                  WHERE [Discriminator] = 'OpenEndedTextQuestionDefinition' AND [Cols] IS NULL AND [Rows] IS NULL");

            Sql(@"UPDATE [dbo].[Questions]
                  SET [Discriminator] = 'OpenEndedLongTextQuestionDefinition'
                  WHERE [Discriminator] = 'OpenEndedTextQuestionDefinition' AND [Cols] IS NOT NULL AND [Rows] IS NOT NULL");

        }

        public override void Down()
        {
            Sql(@"UPDATE [dbo].[Questions]
                  SET [Discriminator] = 'OpenEndedTextQuestionDefinition'
                  WHERE [Discriminator] = 'OpenEndedShortTextQuestionDefinition'");

            Sql(@"UPDATE [dbo].[Questions]
                  SET [Discriminator] = 'OpenEndedTextQuestionDefinition'
                  WHERE [Discriminator] = 'OpenEndedLongTextQuestionDefinition'");
        }
    }
}
