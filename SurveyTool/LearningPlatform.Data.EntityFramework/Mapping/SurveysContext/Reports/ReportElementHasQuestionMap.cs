using System.Data.Entity.ModelConfiguration;
using LearningPlatform.Domain.ReportDesign.ReportElements;

namespace LearningPlatform.Data.EntityFramework.Mapping.SurveysContext.Reports
{
    internal class ReportElementHasQuestionMap : EntityTypeConfiguration<ReportElementHasQuestion>
    {
        public ReportElementHasQuestionMap()
        {
            Property(t => t.QuestionAlias)
                .IsRequired();
        }
    }
}