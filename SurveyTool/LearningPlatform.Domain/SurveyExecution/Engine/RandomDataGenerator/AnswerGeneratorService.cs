using System;
using System.Collections.Generic;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyExecution.Questions;

namespace LearningPlatform.Domain.SurveyExecution.Engine.RandomDataGenerator
{
    public class AnswerGeneratorService
    {
        private readonly RandomDataGeneratorHelper _randomDataGeneratorHelper;
        private readonly Dictionary<Type, IAnswerGenerator> _answerGenerators = new Dictionary<Type, IAnswerGenerator>();

        public AnswerGeneratorService(RandomDataGeneratorHelper randomDataGeneratorHelper,
            MultipleSelectionQuestionGenerator multipleSelectionQuestionGenerator,
            SingleSelectionQuestionGenerator singleSelectionQuestionGenerator,
            OpenEndedTextQuestionGenerator openEndedTextQuestionGenerator,
            GridQuestionGenerator gridQuestionGenerator,
            NumericQuestionGenerator numericQuestionGenerator,
            DateQuestionGenerator dateQuestionGenerator)
        {
            _randomDataGeneratorHelper = randomDataGeneratorHelper;
            ConfigureGenerators(
                multipleSelectionQuestionGenerator,
                singleSelectionQuestionGenerator,
                openEndedTextQuestionGenerator,
                gridQuestionGenerator,
                numericQuestionGenerator,
                dateQuestionGenerator);
        }

        private void ConfigureGenerators(params IAnswerGenerator[] generators)
        {
            foreach (var command in generators)
            {
                _answerGenerators[command.TypeFor] = command;
            }
        }

        public Type TypeFor { get { return null; } }
        public void GenerateAnswer(Question question, QuestionDefinition definition, bool isInRequiredGridQuestion = false)
        {
            if (!_randomDataGeneratorHelper.ShouldAnswerQuestion(definition, isInRequiredGridQuestion)) return;

            var type = question.GetType();
            while (type != null && type != typeof (object))
            {
                IAnswerGenerator generator;
                if (_answerGenerators.TryGetValue(type, out generator))
                {
                    generator.GenerateAnswer(question, definition, this);
                    return;
                }
                type = type.BaseType;
            }

        }
    }
}