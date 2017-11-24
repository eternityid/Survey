using System.Collections.Generic;

namespace LearningPlatform.Data.EntityFramework.SurveysDb.Migrations
{
    public partial class QuestionDefinitionIdAsString : DbMigrationExtended
    {
        public override void Up()
        {
            ConvertIdColumn("dbo.Questions", new[]
            {
                new KeyValuePair<string,string>("dbo.Options", "OtherQuestionDefinitionId"),
                new KeyValuePair<string,string>("dbo.Questions", "ParentQuestionId"),
                new KeyValuePair<string,string>("dbo.Questions", "SubQuestionDefinitionId"),
                new KeyValuePair<string,string>("dbo.QuestionValidators", "QuestionDefinitionId")
            });

            AlterColumn("dbo.Loops", "OptionsMaskQuestionId", c => c.String());
            AlterColumn("dbo.Options", "OptionsMaskQuestionId", c => c.String());
            AlterColumn("dbo.Questions", "OptionsMaskQuestionId", c => c.String());
            AlterColumn("dbo.SkipCommands", "SkipToQuestionId", c => c.String());
            AlterColumn("dbo.ExpressionItems", "QuestionId", c => c.String());


            //DropForeignKey("dbo.QuestionValidators", "QuestionDefinitionId", "dbo.Questions");
            //DropForeignKey("dbo.Questions", "ParentQuestionId", "dbo.Questions");
            //DropForeignKey("dbo.Questions", "SubQuestionDefinitionId", "dbo.Questions");
            //DropForeignKey("dbo.Options", "OtherQuestionDefinitionId", "dbo.Questions");
            //DropIndex("dbo.Options", new[] { "OtherQuestionDefinitionId" });
            //DropIndex("dbo.Questions", new[] { "ParentQuestionId" });
            //DropIndex("dbo.Questions", new[] { "SubQuestionDefinitionId" });
            //DropIndex("dbo.QuestionValidators", new[] { "QuestionDefinitionId" });
            //DropPrimaryKey("dbo.Questions");
            //AlterColumn("dbo.Loops", "OptionsMaskQuestionId", c => c.String());
            //AlterColumn("dbo.Options", "OtherQuestionDefinitionId", c => c.String(maxLength: 128));
            //AlterColumn("dbo.Options", "OptionsMaskQuestionId", c => c.String());
            //AlterColumn("dbo.Questions", "Id", c => c.String(nullable: false, maxLength: 128));
            //AlterColumn("dbo.Questions", "OptionsMaskQuestionId", c => c.String());
            //AlterColumn("dbo.Questions", "ParentQuestionId", c => c.String(maxLength: 128));
            //AlterColumn("dbo.Questions", "SubQuestionDefinitionId", c => c.String(maxLength: 128));
            //AlterColumn("dbo.SkipCommands", "SkipToQuestionId", c => c.String());
            //AlterColumn("dbo.ExpressionItems", "QuestionId", c => c.String());
            //AlterColumn("dbo.QuestionValidators", "QuestionDefinitionId", c => c.String(maxLength: 128));
            //AddPrimaryKey("dbo.Questions", "Id");
            //CreateIndex("dbo.Options", "OtherQuestionDefinitionId");
            //CreateIndex("dbo.Questions", "ParentQuestionId");
            //CreateIndex("dbo.Questions", "SubQuestionDefinitionId");
            //CreateIndex("dbo.QuestionValidators", "QuestionDefinitionId");
            //AddForeignKey("dbo.QuestionValidators", "QuestionDefinitionId", "dbo.Questions", "Id");
            //AddForeignKey("dbo.Questions", "ParentQuestionId", "dbo.Questions", "Id");
            //AddForeignKey("dbo.Questions", "SubQuestionDefinitionId", "dbo.Questions", "Id");
            //AddForeignKey("dbo.Options", "OtherQuestionDefinitionId", "dbo.Questions", "Id");
        }

        public override void Down()
        {
            //DropForeignKey("dbo.Options", "OtherQuestionDefinitionId", "dbo.Questions");
            //DropForeignKey("dbo.Questions", "SubQuestionDefinitionId", "dbo.Questions");
            //DropForeignKey("dbo.Questions", "ParentQuestionId", "dbo.Questions");
            //DropForeignKey("dbo.QuestionValidators", "QuestionDefinitionId", "dbo.Questions");
            //DropIndex("dbo.QuestionValidators", new[] { "QuestionDefinitionId" });
            //DropIndex("dbo.Questions", new[] { "SubQuestionDefinitionId" });
            //DropIndex("dbo.Questions", new[] { "ParentQuestionId" });
            //DropIndex("dbo.Options", new[] { "OtherQuestionDefinitionId" });
            //DropPrimaryKey("dbo.Questions");
            //AlterColumn("dbo.QuestionValidators", "QuestionDefinitionId", c => c.Long(nullable: false));
            //AlterColumn("dbo.ExpressionItems", "QuestionId", c => c.Long());
            //AlterColumn("dbo.SkipCommands", "SkipToQuestionId", c => c.Long(nullable: false));
            //AlterColumn("dbo.Questions", "SubQuestionDefinitionId", c => c.Long());
            //AlterColumn("dbo.Questions", "ParentQuestionId", c => c.Long());
            //AlterColumn("dbo.Questions", "OptionsMaskQuestionId", c => c.Long());
            //AlterColumn("dbo.Questions", "Id", c => c.Long(nullable: false, identity: true));
            //AlterColumn("dbo.Options", "OptionsMaskQuestionId", c => c.Long());
            //AlterColumn("dbo.Options", "OtherQuestionDefinitionId", c => c.Long());
            //AlterColumn("dbo.Loops", "OptionsMaskQuestionId", c => c.Long());
            //AddPrimaryKey("dbo.Questions", "Id");
            //CreateIndex("dbo.QuestionValidators", "QuestionDefinitionId");
            //CreateIndex("dbo.Questions", "SubQuestionDefinitionId");
            //CreateIndex("dbo.Questions", "ParentQuestionId");
            //CreateIndex("dbo.Options", "OtherQuestionDefinitionId");
            //AddForeignKey("dbo.Options", "OtherQuestionDefinitionId", "dbo.Questions", "Id");
            //AddForeignKey("dbo.Questions", "SubQuestionDefinitionId", "dbo.Questions", "Id");
            //AddForeignKey("dbo.Questions", "ParentQuestionId", "dbo.Questions", "Id");
            //AddForeignKey("dbo.QuestionValidators", "QuestionDefinitionId", "dbo.Questions", "Id", cascadeDelete: true);
        }
    }
}
