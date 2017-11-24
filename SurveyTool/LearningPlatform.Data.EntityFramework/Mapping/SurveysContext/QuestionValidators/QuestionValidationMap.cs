using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.SurveyDesign.Validation;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext.QuestionValidators
{
    internal class QuestionValidationMap : EntityTypeConfiguration<QuestionValidation>
    {
        public QuestionValidationMap()
        {
            HasKey(t => t.Id);
            ToTable("QuestionValidators");
        }
    }
}