using System;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyExecution.Questions;

namespace LearningPlatform.Domain.SurveyExecution.Engine.RandomDataGenerator
{
    internal interface IAnswerGenerator
    {
        Type TypeFor { get; }
        void GenerateAnswer(Question question, QuestionDefinition definition, AnswerGeneratorService answerGeneratorService);
    }
}