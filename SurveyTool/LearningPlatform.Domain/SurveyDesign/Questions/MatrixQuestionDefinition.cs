using LearningPlatform.Domain.Constants;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Runtime.Serialization;

namespace LearningPlatform.Domain.SurveyDesign.Questions
{
    public class MatrixQuestionDefinition : QuestionWithOptionsDefinition
    {
        private ICollection<QuestionWithOptionsDefinition> _questionDefinitions =
            new Collection<QuestionWithOptionsDefinition>();

        public ICollection<QuestionWithOptionsDefinition> QuestionDefinitions
        {
            get { return _questionDefinitions; }
            private set { _questionDefinitions = value; }
        }

        public bool Transposed { get; set; }

        public void AddQuestionDefinition(QuestionWithOptionsDefinition questionDefinition)
        {
            questionDefinition.SetParentMatrixQuestionDefinition(this);
            _questionDefinitions.Add(questionDefinition);
        }

        [OnDeserialized]
        internal void OnDeserializedMethod(StreamingContext context)
        {
            foreach (QuestionWithOptionsDefinition questionDefinition in _questionDefinitions)
            {
                questionDefinition.SetParentMatrixQuestionDefinition(this);
            }
        }

        public override string Type => QuestionTypeConstants.Matrix;
    }
}