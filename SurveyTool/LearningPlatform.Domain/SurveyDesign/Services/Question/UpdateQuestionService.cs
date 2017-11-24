using LearningPlatform.Domain.Exceptions;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Services;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using MongoDB.Bson;
using System;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyDesign.Services.Question
{
    public class UpdateQuestionService
    {

        private readonly IOptionListRepository _optionListRepository;
        private readonly ValidateQuestionService _validateQuestionService;
        private readonly IQuestionDefinitionRepository _questionDefinitionRepository;
        private readonly PictureQuestionService _pictureQuestionService;
        public UpdateQuestionService(IOptionListRepository optionListRepository,
            IQuestionDefinitionRepository questionDefinitionRepository,
            ValidateQuestionService validateQuestionService,
            PictureQuestionService pictureQuestionService)
        {
            _optionListRepository = optionListRepository;
            _validateQuestionService = validateQuestionService;
            _questionDefinitionRepository = questionDefinitionRepository;
            _pictureQuestionService = pictureQuestionService;
        }

        public QuestionDefinition Update(QuestionDefinition oldQuestion, QuestionDefinition newQuestion, IList<FileUpload> pictureOptions)
        {
            return oldQuestion.GetType() != newQuestion.GetType() ?
                ChangeQuestion(oldQuestion, newQuestion, pictureOptions) :
                UpdateQuestion(newQuestion, pictureOptions);
        }

        private QuestionDefinition UpdateQuestion(QuestionDefinition newQuestion, IList<FileUpload> pictureOptions)
        {
            var validationResult = _validateQuestionService.Validate(newQuestion);
            if (!validationResult.Valid)
            {
                throw new InvalidQuestionExeption();
            }

            var newQuestionWithOptions = newQuestion as QuestionWithOptionsDefinition;
            if (newQuestionWithOptions != null)
            {
                UpdateOptionList(newQuestionWithOptions);
                newQuestionWithOptions.OptionListId = newQuestionWithOptions.OptionList.Id;
            }

            var newGridQuestion = newQuestion as GridQuestionDefinition;
            var subQuestionWithOptions = newGridQuestion?.SubQuestionDefinition as QuestionWithOptionsDefinition;
            if (subQuestionWithOptions != null)
            {
                UpdateOptionList(subQuestionWithOptions);
                subQuestionWithOptions.OptionListId = subQuestionWithOptions.OptionList.Id;
            }
            newQuestion.Version = Guid.NewGuid().ToString();
            _questionDefinitionRepository.Update(newQuestion);

            return newQuestion;
        }


        private QuestionDefinition ChangeQuestion(QuestionDefinition oldQuestion, QuestionDefinition newQuestion, IList<FileUpload> pictureOptions)
        {
            var validationResult = _validateQuestionService.Validate(newQuestion);
            if (!validationResult.Valid)
            {
                throw new InvalidQuestionExeption();
            }

            //Remove old option lists
            DeleteOptionList(oldQuestion as QuestionWithOptionsDefinition);
            var oldGridQuestion = oldQuestion as GridQuestionDefinition;
            if (oldGridQuestion != null)
            {
                DeleteOptionList(oldGridQuestion.SubQuestionDefinition as QuestionWithOptionsDefinition);
            }

            //Insert new option lists
            var newQuestionWithOptions = newQuestion as QuestionWithOptionsDefinition;
            if (newQuestionWithOptions != null)
            {
                InsertOptionList(newQuestionWithOptions);
                newQuestionWithOptions.OptionListId = newQuestionWithOptions.OptionList.Id;
            }

            var newGridQuestion = newQuestion as GridQuestionDefinition;
            var subQuestionWithOptions = newGridQuestion?.SubQuestionDefinition as QuestionWithOptionsDefinition;
            if (subQuestionWithOptions != null)
            {
                InsertOptionList(subQuestionWithOptions);
                subQuestionWithOptions.OptionListId = subQuestionWithOptions.OptionList.Id;
            }
            newQuestion.Version = Guid.NewGuid().ToString();
            _questionDefinitionRepository.Update(newQuestion);

            return newQuestion;
        }

        private void DeleteOptionList(QuestionWithOptionsDefinition question)
        {
            if (question != null)
            {
                _optionListRepository.Delete(question.OptionList.Id);
            }
        }

        private void InsertOptionList(QuestionWithOptionsDefinition question)
        {
            if (question == null) return;
            question.OptionList.Id = null;
            foreach (var option in question.OptionList.Options)
            {
                option.Id = ObjectId.GenerateNewId().ToString();
            }
            if (question.OptionList.OptionGroups != null)
            {
                foreach (var optionGroup in question.OptionList.OptionGroups)
                {
                    optionGroup.Id = ObjectId.GenerateNewId().ToString();
                }
            }

            _optionListRepository.Add(question.OptionList);
        }

        private void UpdateOptionList(QuestionWithOptionsDefinition question)
        {
            if (question == null) return;
            foreach (var option in question.OptionList.Options)
            {
                if (option.Id == null)
                {
                    option.Id = ObjectId.GenerateNewId().ToString();
                }

                if (option.OtherQuestionDefinition != null && string.IsNullOrEmpty(option.OtherQuestionDefinitionId))
                {
                    var otherQuestionId = ObjectId.GenerateNewId().ToString();
                    option.OtherQuestionDefinition.Id = otherQuestionId;
                    option.OtherQuestionDefinitionId = otherQuestionId;
                }
            }
            if (question.OptionList.OptionGroups != null)
            {
                foreach (var optionGroup in question.OptionList.OptionGroups)
                {
                    if (optionGroup.Id == null)
                    {
                        optionGroup.Id = ObjectId.GenerateNewId().ToString();
                    }
                }
            }
            _optionListRepository.Update(question.OptionList);
        }
    }
}
