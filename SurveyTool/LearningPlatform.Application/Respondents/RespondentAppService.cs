using System.Collections.Generic;
using LearningPlatform.Domain.Respondents;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;

namespace LearningPlatform.Application.Respondents
{
    public class RespondentAppService
    {
        private readonly RespondentService _respondentService;
        private readonly IRespondentRepository _respondentRepository;
        private readonly RespondentImportService _respondentImportService;
        private readonly RespondentEmailingService _respondentEmailingService;


        public RespondentAppService(RespondentService respondentService,
            IRespondentRepository respondentRepository,
            RespondentImportService respondentImportService,
            RespondentEmailingService respondentEmailingService)
        {
            _respondentService = respondentService;
            _respondentRepository = respondentRepository;
            _respondentImportService = respondentImportService;
            _respondentEmailingService = respondentEmailingService;
        }


        public List<Respondent> Search(RespondentSearchFilter filter, int start, int limit, bool isTesting)
        {
            return _respondentRepository.Search(filter, start, limit, isTesting);
        }

        public List<Respondent> Search(RespondentSearchFilter filter, bool isTesting)
        {
            return _respondentRepository.Search(filter, isTesting);
        }

        public int Count(RespondentSearchFilter filter, bool isTesting)
        {
            return _respondentRepository.Count(filter, isTesting);
        }

        public RespondentDetail GetRespondentDetail(string surveyId, long respondentId, bool isTesting)
        {
            return _respondentService.GetRespondentDetail(surveyId, respondentId, isTesting);
        }

        public void AddRespondents(string surveyId, IList<string> respondentEmails, bool isTesting)
        {
            _respondentService.AddRespondents(surveyId, respondentEmails, isTesting);
        }

        public void DeleteRespondents(string surveyId, IList<long> respondentIds, bool isTesting)
        {
            _respondentService.DeleteRespondents(surveyId, respondentIds, isTesting);
        }

        public string Import(string surveyId, bool isTesting, string fileName)
        {
            return _respondentImportService.Import(surveyId, isTesting, fileName);
        }

        public void SendEmailToRespondents(string surveyId, string subject, string content, List<Respondent> respondents, bool isTesting)
        {
            _respondentEmailingService.SendEmailToRespondents(surveyId, subject, content, respondents, isTesting);
        }

        public void SendInvitationEmailToRespondents(string surveyId, string subject, string content, string[] emailAddresses, bool isTesting)
        {
            _respondentEmailingService.SendInvitationEmailToRespondents(surveyId, subject, content, emailAddresses, isTesting);
        }

    }
}
