namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class AddStepAndDecimalPlacesValidationForNumericQuestion : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Questions", "Step", c => c.Double());
            AddColumn("dbo.QuestionValidators", "DecimalPlaces", c => c.Int());
        }

        public override void Down()
        {
            DropColumn("dbo.QuestionValidators", "DecimalPlaces");
            DropColumn("dbo.Questions", "Step");
        }
    }
}
