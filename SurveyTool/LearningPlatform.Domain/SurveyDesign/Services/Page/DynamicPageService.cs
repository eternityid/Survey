using System;
using System.Linq;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.Questions;

namespace LearningPlatform.Domain.SurveyDesign.Services.Page
{
    public class DynamicPageService
    {
        public bool IsDynamicPage(PageDefinition pageDef)
        {
            if (pageDef == null) throw new ArgumentNullException(nameof(pageDef));
            return pageDef.QuestionDefinitions.Any(IsDynamicQuestion);
        }

        private bool IsDynamicQuestion(QuestionDefinition questionDef)
        {
            if (questionDef.QuestionMaskExpression != null && questionDef.QuestionMaskExpression.ExpressionItems.Any()) return true;

            var questionWithOptionsDef = questionDef as QuestionWithOptionsDefinition;
            if (questionWithOptionsDef != null)
            {
                if (questionWithOptionsDef.OptionsMask?.QuestionId != null) return true;
                if (questionWithOptionsDef.OptionList.Options.Any(option => option.OptionsMask?.QuestionId != null)) return true;

                var gridQuestionDef = questionWithOptionsDef as GridQuestionDefinition;
                var subQuestionWithOptionsDef = gridQuestionDef?.SubQuestionDefinition as QuestionWithOptionsDefinition;
                if (subQuestionWithOptionsDef != null)
                {
                    if (subQuestionWithOptionsDef.OptionsMask?.QuestionId != null) return true;
                    if (subQuestionWithOptionsDef.OptionList.Options.Any(option => option.OptionsMask?.QuestionId != null)) return true;
                }
            }
            return false;
        }
    }
}
