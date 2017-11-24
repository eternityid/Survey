using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.SurveyDesign.Validation;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext.QuestionValidators
{
    internal class RangeNumberValidationMap : EntityTypeConfiguration<RangeNumberValidation>
    {
        public RangeNumberValidationMap()
        {
            ToTable("QuestionValidators");
        }
    }
}