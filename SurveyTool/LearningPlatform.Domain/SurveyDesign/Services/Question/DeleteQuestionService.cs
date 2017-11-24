using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;

namespace LearningPlatform.Domain.SurveyDesign.Services.Question
{
    public class DeleteQuestionService
    {
        private readonly IQuestionDefinitionRepository _questionDefinitionRepository;
        private readonly ILibraryQuestionRepository _libraryQuestionRepository;
        private readonly IOptionListRepository _optionListRepository;

        public DeleteQuestionService(IQuestionDefinitionRepository questionDefinitionRepository,
            ILibraryQuestionRepository libraryQuestionRepository,
            IOptionListRepository optionListRepository)
        {
            _questionDefinitionRepository = questionDefinitionRepository;
            _libraryQuestionRepository = libraryQuestionRepository;
            _optionListRepository = optionListRepository;
        }

        public void DeleteQuestion(QuestionDefinition question)
        {
            _questionDefinitionRepository.Delete(question.Id);

            var questionWithOptions = question as QuestionWithOptionsDefinition;
            if (questionWithOptions != null) DeleteOptionList(questionWithOptions);

            var gridQuestion = question as GridQuestionDefinition;
            if (gridQuestion != null) DeleteOptionList(gridQuestion.SubQuestionDefinition as QuestionWithOptionsDefinition);
        }

        public void DeleteLibraryQuestion(QuestionDefinition question)
        {
            _libraryQuestionRepository.Delete(question);

            var questionWithOptions = question as QuestionWithOptionsDefinition;
            if (questionWithOptions != null) DeleteOptionList(questionWithOptions);

            var gridQuestion = question as GridQuestionDefinition;
            if (gridQuestion != null) DeleteOptionList(gridQuestion.SubQuestionDefinition as QuestionWithOptionsDefinition);
        }

        private void DeleteOptionList(QuestionWithOptionsDefinition question)
        {
            if (question != null) _optionListRepository.Delete(question.OptionListId);
        }
    }
}
