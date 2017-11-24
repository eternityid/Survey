using System.Linq;
using System.Web;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyExecution;
using LearningPlatform.Domain.SurveyExecution.Questions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using LearningPlatform.Domain.SurveyDesign.Surveys;

namespace LearningPlatform.Specs
{
    public class PageContext
    {
        private readonly SurveyContext _surveyContext;
        private readonly InstanceContext _instances;

        public PageContext(SurveyContext surveyContext, InstanceContext instances)
        {
            _surveyContext = surveyContext;
            _instances = instances;
        }

        public Page Page { get; set; }

        public Question AssertQuestionOnPage(string questionId)
        {
            var question = GetQuestion(questionId);

            Assert.IsNotNull(question, "Could not find question " + questionId);
            return question;
        }

        public Question GetQuestion(string questionId)
        {
            Question question = Page.Questions.FirstOrDefault(o => o.Alias == questionId);

            if (question == null)
            {
                foreach (var q in Page.Questions)
                {
                    var questionWithOptions = q as QuestionWithOptions;
                    if (questionWithOptions != null)
                    {
                        foreach (var other in questionWithOptions.GetOtherQuestions())
                        {
                            if (other.Question.Alias == questionId)
                                return other.Question;
                        }
                    }
                }
            }
            return question;
        }

        public void StartSurvey(Survey survey)
        {
            Page = _instances.SurveyAppService.BeginOpenSurvey(survey.Id, false);
        }

        public void ResumeSurvey()
        {
            var resumeContext = _instances.RespondentUrlService.GetRespondentSecurityQueryParameter(_instances.RequestContext.Respondent);
            Page = _instances.SurveyAppService.ResumeSurvey(_surveyContext.SurveyId, false, HttpUtility.UrlDecode(resumeContext));
        }


        public void LaunchSurvey(Survey survey)
        {
            _surveyContext.AddSurvey(survey);
            survey.Status = SurveyStatus.Open;
            _instances.PublishingService.Publish(survey.Id);
        }

        public void ClearRepositories()
        {
            _instances.SurveyRepository.Clear();
            _instances.ResponseRowRepository.Clear();
            _instances.RespondentRepository.Clear();
        }
    }
}