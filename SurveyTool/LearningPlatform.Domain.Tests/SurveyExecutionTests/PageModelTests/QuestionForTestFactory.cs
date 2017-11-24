using System.Collections.Generic;
using Autofac.Extras.Moq;
using LearningPlatform.Domain.SurveyExecution.Options;
using LearningPlatform.Domain.SurveyExecution.Questions;

namespace LearningPlatform.Domain.Tests.SurveyExecutionTests.PageModelTests
{
    public class QuestionForTestFactory
    {
        private readonly AutoMock _autoMock;

        public QuestionForTestFactory(AutoMock autoMock)
        {
            _autoMock = autoMock;
        }

        public MultipleSelectionQuestion MultipleSelection(string name, string heading, string text, IEnumerable<string> answerIndices, params Option[] options)
        {
            var multipleSelectionQuestion = new MultipleSelectionQuestion
            {
                Alias = name,
                Options = options,
                TitleEvaluationString = EvaluationStringFactory.Create(heading, _autoMock),
                DescriptionEvaulationString = EvaluationStringFactory.Create(text, _autoMock)
            };
            foreach (var answer in answerIndices)
            {
                multipleSelectionQuestion.MultipleSelectionAnswer.AddAnswer(answer, true);
            }
            return multipleSelectionQuestion;
        }

        public SingleSelectionQuestion SingleSelection(string name, string heading, string text, string answer, params Option[] options)
        {
            return new SingleSelectionQuestion
            {
                Alias = name,
                Options = options,
                TitleEvaluationString = EvaluationStringFactory.Create(heading, _autoMock),
                DescriptionEvaulationString = EvaluationStringFactory.Create(text, _autoMock),
                Answer = answer
            };
        }

        public SingleSelectionGridQuestion SingleSelectionGrid(string name, string heading, string text, Question[] questions,  params Option[] options)
        {
            return new SingleSelectionGridQuestion
            {
                Alias = name,
                Options = options,
                Questions = questions,
                TitleEvaluationString = EvaluationStringFactory.Create(heading, _autoMock),
                DescriptionEvaulationString = EvaluationStringFactory.Create(text, _autoMock)
            };
        }


        public Option Option(string code, string text)
        {
            var option = new Option {Alias = code, TextEvaluationString = EvaluationStringFactory.Create(text, _autoMock) };
            return option;
        }
    }
}