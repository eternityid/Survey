using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using MongoDB.Bson;
using System;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyDesign.Services.Question
{
    public class InsertLibraryQuestionService
    {
        private readonly ILibraryQuestionRepository _libraryQuestionRepository;
        private readonly IOptionListRepository _optionListRepository;

        public InsertLibraryQuestionService(ILibraryQuestionRepository libraryQuestionRepository,
            IOptionListRepository optionListRepository)
        {
            _libraryQuestionRepository = libraryQuestionRepository;
            _optionListRepository = optionListRepository;
        }

        public QuestionDefinition Insert(QuestionDefinition sourceQuestion, string libraryId)
        {
            var newQuestion = sourceQuestion.DeepCopyByExpressionTree();
            newQuestion.Id = null;
            newQuestion.SurveyId = null;
            newQuestion.LibraryId = libraryId;
            newQuestion.QuestionMaskExpression = null;
            newQuestion.QuestionMask = null;
            newQuestion.Version = Guid.NewGuid().ToString();

            var newOptionLists = new List<OptionList>();
            var questionWithOptions = newQuestion as QuestionWithOptionsDefinition;
            if (questionWithOptions != null)
            {
                BuildOptionList(questionWithOptions);
                newOptionLists.Add(questionWithOptions.OptionList);
            }

            var gridQuestionDefinition = newQuestion as GridQuestionDefinition;
            var subQuestionWithOptions = gridQuestionDefinition?.SubQuestionDefinition as QuestionWithOptionsDefinition;
            if (subQuestionWithOptions != null)
            {
                subQuestionWithOptions.SurveyId = null;
                BuildOptionList(subQuestionWithOptions);
                newOptionLists.Add(subQuestionWithOptions.OptionList);
            }

            _optionListRepository.AddMany(newOptionLists);
            _libraryQuestionRepository.Add(newQuestion);

            return newQuestion;
        }

        private void BuildOptionList(QuestionWithOptionsDefinition question)
        {
            question.OptionList.Id = ObjectId.GenerateNewId().ToString();
            question.OptionListId = question.OptionList.Id;
            question.OptionsMask = new OptionsMask();

            question.OptionList.Options.RemoveAll(p => p.OptionsMask?.QuestionId != null);
            question.OptionList.SurveyId = null;

            foreach (var option in question.OptionList.Options)
            {
                option.Id = ObjectId.GenerateNewId().ToString();
                if (option.OtherQuestionDefinition != null)
                {
                    option.OtherQuestionDefinition.Id = ObjectId.GenerateNewId().ToString();
                    option.OtherQuestionDefinitionId = option.OtherQuestionDefinition.Id;
                }
            }
        }
    }
}

