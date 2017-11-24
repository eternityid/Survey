using LearningPlatform.Application.Libraries.Dtos;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using LearningPlatform.Domain.SurveyDesign.Services.Libraries;
using LearningPlatform.Domain.SurveyDesign.Services.Question;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Application.Libraries
{
    public class LibraryQuestionAppService
    {
        private readonly InsertLibraryQuestionService _insertLibraryQuestionService;
        private readonly ReadLibraryService _readLibraryService;
        private readonly ReadQuestionService _readQuestionService;
        private readonly DeleteQuestionService _deleteQuestionService;
        private readonly ILibraryQuestionRepository _libraryQuestionRepository;

        public LibraryQuestionAppService(InsertLibraryQuestionService insertLibraryQuestionService,
            ReadLibraryService readLibraryService,
            ReadQuestionService readQuestionService,
            ILibraryQuestionRepository libraryQuestionRepository,
            DeleteQuestionService deleteQuestionService)
        {
            _insertLibraryQuestionService = insertLibraryQuestionService;
            _readLibraryService = readLibraryService;
            _readQuestionService = readQuestionService;
            _libraryQuestionRepository = libraryQuestionRepository;
            _deleteQuestionService = deleteQuestionService;
        }

        public void InsertQuestion(QuestionDefinition question, string userId)
        {
            if (question == null) throw new ArgumentNullException(nameof(question));

            var defaultLibrary = _readLibraryService.GetDefaultLibraryByUserId(userId);
            _insertLibraryQuestionService.Insert(question, defaultLibrary.Id);
        }

        public IList<QuestionDefinition> GetShallowQuestionsByUserId(string userId)
        {
            var defaultLibrary = _readLibraryService.GetDefaultLibraryByUserId(userId);
            return _libraryQuestionRepository.GetQuestionsByLibraryId(defaultLibrary.Id);
        }

        public QuestionDefinition GetShallowQuestion(string libraryId, string questionId)
        {
            return _libraryQuestionRepository.GetQuestion(libraryId, questionId);
        }

        public IList<QuestionDefinition> GetShallowQuestions(string libraryId, IList<string> questionIds)
        {
            return _libraryQuestionRepository.GetQuestions(libraryId, questionIds);
        }

        public SearchLibraryQuestionResultDto SearchQuestions(string userId, SearchLibraryQuestionDto searchDto)
        {
            var defaultLibrary = _readLibraryService.GetDefaultLibraryByUserId(userId);

            var totalQuestions = _libraryQuestionRepository.CountByLibraryId(defaultLibrary.Id, searchDto.Query);
            var questions = _libraryQuestionRepository.SearchByLibraryId(defaultLibrary.Id, searchDto.Query, searchDto.Limit, searchDto.Offset);

            return new SearchLibraryQuestionResultDto
            {
                TotalQuestions = totalQuestions,
                Questions = questions
            };
        }

        public QuestionDefinition DuplicateQuestion(QuestionDefinition question)
        {
            _readQuestionService.PopulateQuestionContent(question);

            var defaultQuestionTitle = question.Title.Items.FirstOrDefault();
            if (defaultQuestionTitle != null) defaultQuestionTitle.Text = $"Copy of {defaultQuestionTitle.Text}";

            return _insertLibraryQuestionService.Insert(question, question.LibraryId);
        }

        public void DeleteQuestion(QuestionDefinition question)
        {
            _readQuestionService.PopulateQuestionContent(question);
            _deleteQuestionService.DeleteLibraryQuestion(question);
        }

        public void UpdateQuestion(QuestionDefinition question, UpdateLibraryQuestionDto updateDto)
        {
            var defaultQuestionTitle = question.Title.Items.FirstOrDefault();
            if (defaultQuestionTitle != null) defaultQuestionTitle.Text = updateDto.Title;

            var defaultQuestionDescription = question.Description.Items.FirstOrDefault();
            if (defaultQuestionDescription != null) defaultQuestionDescription.Text = updateDto.Description;

            _libraryQuestionRepository.Update(question);
        }
    }
}
