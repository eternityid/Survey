using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.SurveyDesign.Validation;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext.QuestionValidators
{
    internal class RequiredValidationMap : EntityTypeConfiguration<RequiredValidation>
    {
        public RequiredValidationMap()
        {
            ToTable("QuestionValidators");
        }
    }
}