using System.Collections.Generic;
using System.Linq;
using LearningPlatform.Domain.SurveyExecution.ResponseRows;
using LearningPlatform.Domain.SurveyExecution.TableLayout;
using LearningPlatform.Domain.SurveyExecution.Validators;
using Newtonsoft.Json;

namespace LearningPlatform.Domain.SurveyExecution.Questions
{
    public class Information : Question
    {
        public Information()
        {
            Validators = new List<QuestionValidator>();
        }

        [JsonIgnore]
        public override object Answer { get; set; }

        [JsonIgnore]
        public override List<int> Mask { get; set; }

        public override void AddAnswer(ResponseRow row)
        {
            // Should be empty; Information question does not have answers
        }

        public override void RenderGridCell(Table table)
        {
            table.Rows.Last().AddItem(new LabelCell {Title = Title, Description = Description});
        }
    }
}