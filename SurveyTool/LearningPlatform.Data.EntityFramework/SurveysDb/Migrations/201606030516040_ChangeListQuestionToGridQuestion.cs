using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class ChangeListQuestionToGridQuestion : DbMigration
    {
        public override void Up()
        {
            Sql(@"UPDATE [dbo].[Questions]
                  SET [Discriminator] = 'GridQuestionDefinition'
                  WHERE [Discriminator] = 'ListQuestionDefinition'");
        }

        public override void Down()
        {
            Sql(@"UPDATE [dbo].[Questions]
                  SET [Discriminator] = 'ListQuestionDefinition'
                  WHERE [Discriminator] = 'GridQuestionDefinition'");
        }
    }
}
