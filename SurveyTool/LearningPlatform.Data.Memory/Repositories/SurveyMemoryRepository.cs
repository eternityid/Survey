using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Surveys;
using System.Collections.Generic;

namespace LearningPlatform.Data.Memory.Repositories
{
    public class SurveyMemoryRepository : ISurveyRepository
    {
        private readonly SurveyMemoryContext _context;
        private readonly Dictionary<string, Survey> _surveys = new Dictionary<string, Survey>();

        public SurveyMemoryRepository(SurveyMemoryContext context)
        {
            _context = context;
        }

        public void Clear()
        {
            _context.Clear();
            _surveys.Clear();
        }

        public void Add(Survey survey)
        {
            long surveyId = _surveys.Count + 1;
            survey.Id = ObjectIdHelper.GetObjectIdFromLongString(surveyId.ToString());
            _surveys[survey.Id] = survey;
            _context.Add(survey);
        }

        public Survey GetById(string surveyId)
        {
            return _surveys[surveyId];
        }

        public void Update(Survey survey)
        {
            _context.Add(survey);
        }

        public void Delete(Survey survey)
        {
            throw new System.NotImplementedException();
        }

        public Survey UpdateModifiedDate(string surveyId)
        {
            return null;
        }

        public Survey UpdateLastPublished(string surveyId)
        {
            return null;
        }

        public List<Survey> GetAllSurveys(int start, int limit)
        {
            return null;
        }

        public IEnumerable<Survey> GetByUserId(string userId)
        {
            return null;
        }

        public IList<Survey> GetSurveys(SurveySearchFilter searchModel)
        {
            return null;
        }

        public int Count(SurveySearchFilter surveySearchModel)
        {
            return 0;
        }

        public bool Exists(string surveyId)
        {
            return _surveys.ContainsKey(surveyId);
        }
    }
}