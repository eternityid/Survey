using LearningPlatform.Domain.SurveyDesign.FlowLogic;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.Questions;
using MongoDB.Bson;
using System;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyDesign.Services.Survey
{
    public class OverrideSurveyObjectIdsService
    {
        public void Override(Domain.SurveyDesign.Survey survey)
        {
            if (survey?.TopFolder == null) throw new ArgumentNullException(nameof(survey));

            survey.Id = ObjectId.GenerateNewId().ToString();
            survey.TopFolder.Id = ObjectId.GenerateNewId().ToString();

            survey.TopFolder.SurveyId = survey.Id;
            survey.TopFolderId = survey.TopFolder.Id;

            BuildFolder(survey.TopFolder);
        }

        private void BuildFolder(Folder folder)
        {
            folder.Id = ObjectId.GenerateNewId().ToString();
            folder.ChildIds = new List<string>();

            BuildCondition(folder as Condition);
            foreach (var child in folder.ChildNodes)
            {
                child.Id = ObjectId.GenerateNewId().ToString();
                child.SurveyId = folder.SurveyId;

                var childFolder = child as Folder;
                if (childFolder != null)
                {
                    BuildFolder(childFolder);
                    if (childFolder.Loop?.OptionList != null)
                    {
                        childFolder.Loop.OptionListId = ObjectId.GenerateNewId().ToString();
                        childFolder.Loop.OptionList.Id = childFolder.Loop.OptionListId;
                    }
                }
                BuildPage(child as PageDefinition);
                folder.ChildIds.Add(child.Id);
            }

        }

        private void BuildCondition(Condition condition)
        {
            if (condition == null) return;

            if (condition.TrueFolder != null)
            {
                BuildFolder(condition.TrueFolder);
            }
            if (condition.FalseFolder != null)
            {
                BuildFolder(condition.FalseFolder);
            }
        }


        private void BuildPage(PageDefinition page)
        {
            if (page == null) return;

            page.ChildIds = new List<string>();
            page.QuestionIds = new List<string>();

            foreach (var question in page.QuestionDefinitions)
            {
                question.Id = ObjectId.GenerateNewId().ToString();
                question.SurveyId = page.SurveyId;
                question.PageDefinitionId = page.Id;

                page.QuestionIds.Add(question.Id);

                var questionWithOptionsDefinition = question as QuestionWithOptionsDefinition;
                if (questionWithOptionsDefinition != null)
                {
                    BuildOptionList(questionWithOptionsDefinition);
                }

                var girdQuestionDefinition = question as GridQuestionDefinition;
                if (girdQuestionDefinition != null)
                {
                    girdQuestionDefinition.SubQuestionDefinition.SurveyId = girdQuestionDefinition.SurveyId;
                    BuildOptionList(girdQuestionDefinition.SubQuestionDefinition as QuestionWithOptionsDefinition);
                }
            }
        }

        private void BuildOptionList(QuestionWithOptionsDefinition question)
        {
            if (question?.OptionList == null) return;

            question.OptionList.Id = ObjectId.GenerateNewId().ToString();
            question.OptionListId = question.OptionList.Id;
            question.OptionList.SurveyId = question.SurveyId;

            foreach (var optionGroup in question.OptionList.OptionGroups)
            {
                optionGroup.Id = ObjectId.GenerateNewId().ToString();
            }

            foreach (var option in question.OptionList.Options)
            {
                option.Id = ObjectId.GenerateNewId().ToString();
            }
        }
    }
}
