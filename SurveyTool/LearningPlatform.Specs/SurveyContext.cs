using LearningPlatform.Domain.SurveyDesign;

namespace LearningPlatform.Specs
{
    public class SurveyContext
    {
        private readonly InstanceContext _instances;

        public SurveyContext(InstanceContext instances)
        {
            _instances = instances;
        }

        public string SurveyId { get; set; }

        public void AddSurvey(Survey survey)
        {
            _instances.SurveyRepository.Add(survey);
            SurveyId = survey.Id;
        }

    }
}
