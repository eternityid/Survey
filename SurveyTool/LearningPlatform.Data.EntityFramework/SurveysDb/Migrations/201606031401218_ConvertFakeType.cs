using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class ConvertFakeType : DbMigration
    {
        public override void Up()
        {
            Sql(@"UPDATE [dbo].[Questions]
                  SET [Discriminator] = 'ScaleQuestionDefinition'
                  WHERE [FakeType] = 'ScaleQuestionDefinition'");

            Sql(@"UPDATE [dbo].[Questions]
                  SET [Discriminator] = 'NetPromoterScoreQuestionDefinition'
                  WHERE [FakeType] = 'NetPromoterScoreQuestionDefinition'");

            Sql(@"UPDATE [dbo].[Questions]
                  SET [Discriminator] = 'SingleSelectionGridQuestionDefinition'
                  WHERE [FakeType] = 'SingleSelectionGridQuestionDefinition'");

            Sql(@"UPDATE [dbo].[Questions]
                  SET [Discriminator] = 'MultipleSelectionGridQuestionDefinition'
                  WHERE [FakeType] = 'MultipleSelectionGridQuestionDefinition'");

            Sql(@"UPDATE [dbo].[Questions]
                  SET [Discriminator] = 'ShortTextListQuestionDefinition'
                  WHERE [FakeType] = 'ShortTextListQuestionDefinition'");

            Sql(@"UPDATE [dbo].[Questions]
                  SET [Discriminator] = 'SingleSelectionGridQuestionDefinition'
                  WHERE [Discriminator] = 'GridQuestionDefinition'");


        }

        public override void Down()
        {
            Sql(@"UPDATE [dbo].[Questions]
                  SET [FakeType] = 'ScaleQuestionDefinition'
                  WHERE [Discriminator] = 'ScaleQuestionDefinition'");

            Sql(@"UPDATE [dbo].[Questions]
                  SET [FakeType] = 'NetPromoterScoreQuestionDefinition'
                  WHERE [Discriminator] = 'NetPromoterScoreQuestionDefinition'");

            Sql(@"UPDATE [dbo].[Questions]
                  SET [FakeType] = null
                  WHERE [Discriminator] = 'SingleSelectionGridQuestionDefinition'");

            Sql(@"UPDATE [dbo].[Questions]
                  SET [FakeType] = 'MultipleSelectionGridQuestionDefinition'
                  WHERE [Discriminator] = 'MultipleSelectionGridQuestionDefinition'");

            Sql(@"UPDATE [dbo].[Questions]
                  SET [FakeType] = 'ShortTextListQuestionDefinition'
                  WHERE [Discriminator] = 'ShortTextListQuestionDefinition'");
        }
    }
}
