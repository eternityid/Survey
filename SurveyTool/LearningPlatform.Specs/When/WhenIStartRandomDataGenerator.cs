using System.Diagnostics;
using System.Linq;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.When
{
    [Binding]
    public class WhenIStartRandomDataGenerator
    {
        private readonly InstanceContext _instances;
        private readonly SurveyContext _surveyContext;

        public WhenIStartRandomDataGenerator(InstanceContext instances, SurveyContext surveyContext)
        {
            _instances = instances;
            _surveyContext = surveyContext;
        }

        [When(@"I start random data generator")]
        public void StartRandomDataGenerator()
        {
            _instances.ControlledRandom.Reset(1);
            _instances.RandomDataGenerator.Generate(_surveyContext.SurveyId, 5);
            var rows = _instances.ResponseRowRepository.AllRows;
            Debug.WriteLine("| Id  | SurveyId|RespondentId| QuestionName  | Alias       | AnswerType|IntegerAnswer|DoubleAnswer| DateTimeAnswer    | TextAnswer                  |");
            foreach (var r in rows)
            {
                Debug.WriteLine("| {0,3} | {1,7} | {2,10} | {3,-13} | {4,-10} | {5,-9} | {6,11} | {7,10} |{8,19}| {9,-28}|",
                    r.Id, r.SurveyId, r.RespondentId, r.QuestionName, r.Alias, r.AnswerType, r.IntegerAnswer, r.DoubleAnswer, r.DateTimeAnswer, r.TextAnswer);
            }

        }
    }
}
