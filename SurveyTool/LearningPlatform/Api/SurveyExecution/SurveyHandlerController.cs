using System.Web.Http;
using LearningPlatform.Application.Models;
using LearningPlatform.Application.SurveyExecution;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.Respondents;
using LearningPlatform.Domain.SurveyExecution;
using LearningPlatform.Domain.SurveyExecution.RepositoryContracts;

namespace LearningPlatform.Api.SurveyExecution
{
    [RoutePrefix("api/surveyexecution/{surveyId}")]
    public class SurveyHandlerController : ApiController
    {
        private readonly SurveyAppService _surveyAppService;
        private readonly RespondentUrlService _respondentUrlService;
        private readonly IRespondentSurveyExecutionRepository _respondentRepository;
        private readonly MapperService _mapper;

        public SurveyHandlerController(SurveyAppService surveyAppService, RespondentUrlService respondentUrlService, IRespondentSurveyExecutionRepository respondentRepository, MapperService mapper)
        {
            _surveyAppService = surveyAppService;
            _respondentUrlService = respondentUrlService;
            _respondentRepository = respondentRepository;
            _mapper = mapper;
        }

        [Route("respondent/{respondentId}")]
        public string Get(string surveyId, long respondentId)
        {
            var respondent = _respondentRepository.Get(respondentId, surveyId, false);
            return _respondentUrlService.GetRespondentSecurityQueryParameter(respondent);
        }

        [Route("")]
        public Page Get(string surveyId)
        {
            return _surveyAppService.BeginOpenSurvey(surveyId, false);
        }

        [Route("")]
        public Page Post(string surveyId, [FromBody] Form form)
        {
            return _surveyAppService.Navigate(surveyId, false, _mapper.Map<Direction>(form.Direction), form.GetNameValueCollection());
        }
    }
}