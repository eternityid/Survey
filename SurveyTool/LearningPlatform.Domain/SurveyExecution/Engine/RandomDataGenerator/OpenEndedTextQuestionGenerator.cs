using System;
using System.Collections.Generic;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Validation;
using LearningPlatform.Domain.SurveyExecution.Questions;

namespace LearningPlatform.Domain.SurveyExecution.Engine.RandomDataGenerator
{
    public class OpenEndedTextQuestionGenerator : IAnswerGenerator
    {
        private readonly RandomDataGeneratorHelper _randomDataGeneratorHelper;
        private readonly IThreadSafeRandom _random;

        private string[] _words =
        {
            "dolor", "sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor",
            "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis",
            "nostrud", "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea", "commodo", "consequat",
            "duis", "aute", "irure", "dolor", "in", "reprehenderit", "in", "voluptate", "velit", "esse", "cillum",
            "dolore", "eu", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non",
            "proident", "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
        };

        public OpenEndedTextQuestionGenerator(RandomDataGeneratorHelper randomDataGeneratorHelper, IThreadSafeRandom random)
        {
            _randomDataGeneratorHelper = randomDataGeneratorHelper;
            _random = random;
        }

        public Type TypeFor { get { return typeof (OpenEndedTextQuestion); } }
        public void GenerateAnswer(Question question, QuestionDefinition definition, AnswerGeneratorService answerGeneratorService)
        {
            var maxLength = _randomDataGeneratorHelper.GetNumberToPick<LengthValidation>(definition, 1, 60);
            var maxWords = _randomDataGeneratorHelper.GetNumberToPick<WordsAmountValidation>(definition, 1, 20);

            int length = 0;
            int wordCount = 0;
            bool capitalize = true;
            int sentenceLength = 0;
            List<string> selectedWords = new List<string>();
            while (length < maxLength && wordCount< maxWords)
            {
                var index = _random.Next(0, _words.Length);
                if (capitalize)
                {
                    sentenceLength = 4 + index%4;
                }
                var word = _words[index];
                if (sentenceLength == 0)
                {
                    word = word + ".";
                }
                sentenceLength--;
                selectedWords.Add(capitalize?CapitalizeWord(word):word);
                wordCount++;
                capitalize = word.EndsWith(".");
                length += word.Length + 1;
            }
            question.Answer = string.Join(" ", selectedWords)+".";
        }

        public static string CapitalizeWord(string word)
        {
            return char.ToUpper(word[0]) + word.Substring(1);
        }
    }
}