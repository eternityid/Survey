using LearningPlatform.Application.SurveyDesign.Dtos;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Services;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Question;
using System;
using System.Collections.Generic;
using DeleteQuestionService = LearningPlatform.Domain.SurveyDesign.Services.Question.DeleteQuestionService;
using ReadQuestionService = LearningPlatform.Domain.SurveyDesign.Services.Question.ReadQuestionService;
using UpdateQuestionService = LearningPlatform.Domain.SurveyDesign.Services.Question.UpdateQuestionService;

namespace LearningPlatform.Application.SurveyDesign
{
    public class QuestionDefinitionAppService
    {
        private readonly IQuestionDefinitionRepository _questionDefinitionRepository;
        private readonly INodeRepository _nodeRepository;
        private readonly ReadQuestionService _readQuestionService;
        private readonly MoveQuestionService _moveQuestionService;
        private readonly DeleteQuestionService _deleteQuestionService;
        private readonly UpdateQuestionService _updateQuestionService;
        private readonly InsertQuestionService _insertQuestionService;
        private readonly PictureQuestionService _pictureQuestionService;
        private readonly ISurveyRepository _surveyRepository;

        public QuestionDefinitionAppService(ReadQuestionService readQuestionService,
            MoveQuestionService moveQuestionService,
            IQuestionDefinitionRepository questionDefinitionRepository,
            DeleteQuestionService deleteQuestionService,
            UpdateQuestionService updateQuestionService,
            InsertQuestionService insertQuestionService,
            INodeRepository nodeRepository,
            PictureQuestionService pictureQuestionService,
            ISurveyRepository surveyRepository)
        {
            _readQuestionService = readQuestionService;
            _moveQuestionService = moveQuestionService;
            _questionDefinitionRepository = questionDefinitionRepository;
            _deleteQuestionService = deleteQuestionService;
            _updateQuestionService = updateQuestionService;
            _insertQuestionService = insertQuestionService;
            _nodeRepository = nodeRepository;
            _pictureQuestionService = pictureQuestionService;
            _surveyRepository = surveyRepository;
        }

        public QuestionDefinition GetFullQuestion(string questionId)
        {
            return _readQuestionService.GetFullQuestion(questionId);
        }

        public List<QuestionDefinition> GetAllQuestionsInPage(string surveyId, string pageId)
        {
            return _questionDefinitionRepository.GetAllQuestionsInPage(surveyId, pageId);
        }

        public CreateQuestionResultDto CreateQuestion(PageDefinition page, UpsertQuestionDto upsertQuestionDto)
        {
            _insertQuestionService.Insert(page, upsertQuestionDto.Question, upsertQuestionDto.QuestionIndex);

            var survey = _surveyRepository.UpdateModifiedDate(page.SurveyId);
            return new CreateQuestionResultDto
            {
                PageVersion = page.Version,
                NewQuestion = upsertQuestionDto.Question,
                SurveyVersion = survey.Version
            };
        }

        public QuestionWithSurveyEtagDto UpdateQuestion(QuestionDefinition originalQuestion, UpsertQuestionDto upsertQuestionDto)
        {
            var modifiedQuestion = _updateQuestionService.Update(originalQuestion, upsertQuestionDto.Question, upsertQuestionDto.PictureOptions);

            var survey = _surveyRepository.UpdateModifiedDate(modifiedQuestion.SurveyId);
            return new QuestionWithSurveyEtagDto
            {
                Question = modifiedQuestion,
                SurveyEtag = survey.Version
            };
        }

        public PageWithSurveyEtagDto DeletedQuestion(PageDefinition page, QuestionDefinition question)
        {
            page.QuestionIds.Remove(question.Id);
            page.Version = Guid.NewGuid().ToString();
            _nodeRepository.Update(page);

            _deleteQuestionService.DeleteQuestion(question);
            _pictureQuestionService.DeletePictureOptions(question);

            var survey = _surveyRepository.UpdateModifiedDate(page.SurveyId);
            return new PageWithSurveyEtagDto
            {
                Page = page,
                SurveyEtag = survey.Version
            };
        }

        public CreateQuestionResultDto DuplicateQuestion(PageDefinition page, QuestionDefinition sourceQuestion, string newQuestionAlias)
        {
            var sourceQuestionId = sourceQuestion.Id;

            sourceQuestion.Id = null;
            sourceQuestion.Alias = newQuestionAlias;

            var sourceQuestionIndex = page.QuestionIds.IndexOf(sourceQuestionId);
            _insertQuestionService.Insert(page, sourceQuestion, sourceQuestionIndex + 1);

            if (sourceQuestion is PictureSingleSelectionQuestionDefinition ||
               sourceQuestion is PictureMultipleSelectionQuestionDefinition)
            {
                _pictureQuestionService.DuplicatePictureFolder(page.SurveyId, sourceQuestionId, sourceQuestion.Id);
            }

            var survey = _surveyRepository.UpdateModifiedDate(page.SurveyId);
            return new CreateQuestionResultDto
            {
                PageVersion = page.Version,
                NewQuestion = sourceQuestion,
                SurveyVersion = survey.Version
            };
        }

        public DuplicateQuestionsFromLibaryResultDto DuplicateQuestionsFromLibrary(PageDefinition page, IList<QuestionDefinition> sourceQuestions)
        {
            _insertQuestionService.InsertQuestionsFromLibrary(page, sourceQuestions);

            var survey = _surveyRepository.UpdateModifiedDate(page.SurveyId);

            return new DuplicateQuestionsFromLibaryResultDto
            {
                SurveyVersion = survey.Version,
                PageVersion = page.Version,
                NewQuestions = sourceQuestions
            };
        }

        public MoveQuestionWithSurveyEtagDto MoveQuestion(PageDefinition sourcePage, PageDefinition destinationPage, string questionId, int newQuestionIndex)
        {
            if (string.Equals(sourcePage.Id, destinationPage.Id))
            {
                _moveQuestionService.MoveQuestionInPage(sourcePage, questionId, newQuestionIndex);
            }
            else
            {
                _moveQuestionService.MoveQuestionToOtherPage(sourcePage, destinationPage, questionId, newQuestionIndex);
            }

            var survey = _surveyRepository.UpdateModifiedDate(sourcePage.SurveyId);
            return new MoveQuestionWithSurveyEtagDto
            {
                SourcePage = sourcePage,
                DestinationPage = destinationPage,
                SurveyEtag = survey.Version
            };
        }
    }
}