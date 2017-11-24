using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;

namespace LearningPlatform.Domain.SurveyDesign.Services.Question
{
    public class ReadQuestionService
    {
        private readonly IQuestionDefinitionRepository _questionDefinitionRepository;
        private readonly ILibraryQuestionRepository _libraryQuestionRepository;
        private readonly IOptionListRepository _optionListRepository;

        public ReadQuestionService(IQuestionDefinitionRepository questionDefinitionRepository,
            ILibraryQuestionRepository libraryQuestionRepository,
            IOptionListRepository optionListRepository)
        {
            _questionDefinitionRepository = questionDefinitionRepository;
            _libraryQuestionRepository = libraryQuestionRepository;
            _optionListRepository = optionListRepository;
        }

        public QuestionDefinition GetFullQuestion(string questionId)
        {
            var question = _questionDefinitionRepository.GetById(questionId);
            PopulateQuestionContent(question);
            return question;
        }

        public QuestionDefinition GetFullLibraryQuestion(string libraryId, string questionId)
        {
            var question = _libraryQuestionRepository.GetQuestion(libraryId, questionId);
            PopulateQuestionContent(question);
            return question;
        }

        public void PopulateQuestionContent(QuestionDefinition question)
        {
            if (question == null) return;

            PopulateOptionList(question as QuestionWithOptionsDefinition);

            var gridQuestion = question as GridQuestionDefinition;
            if (gridQuestion != null) PopulateOptionList(gridQuestion.SubQuestionDefinition as QuestionWithOptionsDefinition);
        }

        private void PopulateOptionList(QuestionWithOptionsDefinition questionWithOptions)
        {
            if (questionWithOptions == null) return;
            questionWithOptions.OptionList = _optionListRepository.GetById(questionWithOptions.OptionListId);
        }
    }
}
