using System.Data.Entity.Migrations;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class ChangeGridQuestionToMatrixQuestion : DbMigration
    {
        public override void Up()
        {
            Sql(@"UPDATE [dbo].[Questions]
                  SET [Discriminator] = 'MatrixQuestionDefinition'
                  WHERE [Discriminator] = 'GridQuestionDefinition'");
        }
        
        public override void Down()
        {
            Sql(@"UPDATE [dbo].[Questions]
                  SET [Discriminator] = 'GridQuestionDefinition'
                  WHERE [Discriminator] = 'MatrixQuestionDefinition'");
        }
    }
}
