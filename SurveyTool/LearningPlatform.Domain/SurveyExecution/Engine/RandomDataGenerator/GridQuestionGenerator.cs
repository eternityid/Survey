using System;
using Autofac;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyExecution.Questions;

namespace LearningPlatform.Domain.SurveyExecution.Engine.RandomDataGenerator
{
    public class GridQuestionGenerator : IAnswerGenerator
    {
        public Type TypeFor { get { return typeof (GridQuestion); } }
        public void GenerateAnswer(Question question, QuestionDefinition definition, AnswerGeneratorService answerGeneratorService)
        {
            var gridQuestion = (GridQuestion) question;
            var gridQuestionDefinition = (GridQuestionDefinition)definition;

            foreach (var subQuestion in gridQuestion.Questions)
            {
                answerGeneratorService.GenerateAnswer(subQuestion, gridQuestionDefinition.SubQuestionDefinition, question.IsRequired);
            }
        }
    }
}