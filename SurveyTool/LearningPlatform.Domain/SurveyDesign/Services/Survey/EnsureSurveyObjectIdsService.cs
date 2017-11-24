using LearningPlatform.Domain.Helpers;
using LearningPlatform.Domain.SurveyDesign.FlowLogic;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.Questions;
using MongoDB.Bson;
using System;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyDesign.Services.Survey
{
    public class EnsureSurveyObjectIdsService
    {
        public void EnsureObjectIds(Domain.SurveyDesign.Survey survey)
        {
            if (survey?.TopFolder == null) throw new ArgumentNullException(nameof(survey));

            if (!ObjectIdHelper.Validate(survey.Id))
            {
                survey.Id = ObjectIdHelper.GetObjectIdFromLongString(survey.Id);
            }

            if (!ObjectIdHelper.Validate(survey.LayoutId))
            {
                survey.LayoutId = ObjectIdHelper.GetObjectIdFromLongString(survey.LayoutId);
            }
            if (!ObjectIdHelper.Validate(survey.ThemeId))
            {
                survey.ThemeId = ObjectIdHelper.GetObjectIdFromLongString(survey.ThemeId);
            }

            if (survey.TopFolder.Id == null)
            {
                survey.TopFolder.Id = ObjectId.GenerateNewId().ToString();
            }
            survey.TopFolderId = survey.TopFolder.Id;
            survey.TopFolder.SurveyId = survey.Id;
            BuildFolder(survey.TopFolder);
        }

        private void BuildFolder(Folder folder)
        {
            folder.ChildIds = new List<string>();
            if (folder.Id == null)
            {
                folder.Id = ObjectId.GenerateNewId().ToString();
            }

            BuildCondition(folder as Condition);
            foreach (var child in folder.ChildNodes)
            {
                child.SurveyId = folder.SurveyId;
                if (child.Id == null)
                {
                    child.Id = ObjectId.GenerateNewId().ToString();
                }

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
            foreach (var questionDefinition in page.QuestionDefinitions)
            {
                questionDefinition.SurveyId = page.SurveyId;
                questionDefinition.PageDefinitionId = page.Id;
                if (questionDefinition.Id == null)
                {
                    questionDefinition.Id = ObjectId.GenerateNewId().ToString();

                }
                page.QuestionIds.Add(questionDefinition.Id);

                var questionWithOptionsDefinition = questionDefinition as QuestionWithOptionsDefinition;
                if (questionWithOptionsDefinition != null)
                {
                    BuildOptionList(questionWithOptionsDefinition);
                }

                var girdQuestionDefinition = questionDefinition as GridQuestionDefinition;
                if (girdQuestionDefinition != null)
                {
                    BuildOptionList(girdQuestionDefinition.SubQuestionDefinition as QuestionWithOptionsDefinition);
                }
            }
        }

        private void BuildOptionList(QuestionWithOptionsDefinition question)
        {
            if (question?.OptionList != null && question.OptionList.Id == null)
            {
                question.OptionList.Id = ObjectId.GenerateNewId().ToString();
                question.OptionListId = question.OptionList.Id;
                question.OptionList.SurveyId = question.SurveyId;

                foreach (var optionGroup in question.OptionList.OptionGroups)
                {
                    if (optionGroup.Id == null)
                    {
                        optionGroup.Id = ObjectId.GenerateNewId().ToString();
                    }
                }

                foreach (var option in question.OptionList.Options)
                {
                    if (option.Id == null)
                    {
                        option.Id = ObjectId.GenerateNewId().ToString();
                    }
                }
            }
        }

    }
}
