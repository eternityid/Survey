using System.Linq;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyExecution;
using LearningPlatform.Domain.SurveyExecution.Request;

namespace LearningPlatform.Domain.Resources
{
    public class SurveyResourceManager : IResourceManager
    {
        private readonly IResourceStringRepository _resourceStringRepository;
        private readonly IRequestContext _requestContext;
        private readonly MapperService _mapper;

        public SurveyResourceManager(IResourceStringRepository resourceStringRepository, IRequestContext requestContext, MapperService mapper)
        {
            _resourceStringRepository = resourceStringRepository;
            _requestContext = requestContext;
            _mapper = mapper;
        }

        public EvaluationString GetEvalutationString(string name)
        {
            var surveyId = _requestContext.Survey.Id;
            var resourceStrings = _resourceStringRepository.GetByNameForSurvey(name, surveyId);
            if (resourceStrings.Count == 1) return _mapper.Map<EvaluationString>(resourceStrings.First());
            return _mapper.Map<EvaluationString>(resourceStrings.FirstOrDefault(p => p.SurveyId == surveyId));
        }

        public string GetString(string name, params object[] args)
        {
            var surveyId = _requestContext.Survey.Id;
            var resourceStrings = _resourceStringRepository.GetByNameForSurvey(name, surveyId);
            if (resourceStrings.Count == 1) return Map(resourceStrings.First(), args);
            return Map(resourceStrings.FirstOrDefault(p => p.SurveyId == surveyId), args);
        }

        private string Map(ResourceString resourceString, object[] args)
        {
            if (resourceString == null) return null;
            return string.Format(_mapper.Map<EvaluationString>(resourceString).ToString(), args);
        }
    }
}