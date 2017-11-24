using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyExecution.Questions;
using Newtonsoft.Json;
using System;

namespace LearningPlatform.Domain.SurveyExecution.Options
{
    public class Option : IFixedPosition
    {
        public string Id { get; set; }

        public string Text
        {
            get { return TextEvaluationString != null ? TextEvaluationString.ToString() : ""; }
        }

        public override string ToString()
        {
            return Text;
        }

        public EvaluationString TextEvaluationString { get; set; }

        public OptionGroup OptionGroup { get; set; }

        public string Alias { get; set; }
        public bool IsFixedPosition { get; set; }
        public bool IsExclusive { get; set; }
        public bool IsNotApplicable { get; set; }

        public Question OtherQuestion { get; set; }
        public string PictureName { get; set; }
        [JsonIgnore, Obsolete]
        public int? Position { get; set; }
    }
}