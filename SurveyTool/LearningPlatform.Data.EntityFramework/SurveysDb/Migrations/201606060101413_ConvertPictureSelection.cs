using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class ConvertPictureSelection : DbMigration
    {
        public override void Up()
        {
            Sql(@"UPDATE [dbo].[Questions]
                  SET [Discriminator] = 'SingleSelectionPictureQuestionDefinition'
                  WHERE [Discriminator] = 'SingleSelectionQuestionDefinition' AND IsPictureSelection = 1");

            Sql(@"UPDATE [dbo].[Questions]
                  SET [Discriminator] = 'MultipleSelectionPictureQuestionDefinition'
                  WHERE [Discriminator] = 'MultipleSelectionQuestionDefinition' AND IsPictureSelection = 1");
        }

        public override void Down()
        {
            Sql(@"UPDATE [dbo].[Questions]
                  SET [Discriminator] = 'SingleSelectionQuestionDefinition', IsPictureSelection = 1
                  WHERE [Discriminator] = 'SingleSelectionPictureQuestionDefinition'");

            Sql(@"UPDATE [dbo].[Questions]
                  SET [Discriminator] = 'MultipleSelectionQuestionDefinition', IsPictureSelection = 1
                  WHERE [Discriminator] = 'MultipleSelectionPictureQuestionDefinition'");
        }
    }
}
