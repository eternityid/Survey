using LearningPlatform.Domain.Reporting.Respondents;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using LearningPlatform.Domain.SurveyPublishing;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Domain.SurveyDesign.Questions.Services
{
    //TODO: Rename this service or better apply SRP
    public class ReadQuestionService
    {
        private readonly PublishingService _publishingService;

        public ReadQuestionService(PublishingService publishingService)
        {
            _publishingService = publishingService;
        }

        public List<QuestionDefinition> GetLatestVersionQuestions(string surveyId)
        {
            return GetQuestionsFromSurveyAndLayout(_publishingService.GetLatestVersion(surveyId));
        }

        public List<QuestionDefinition> GetUnpublishedVersionQuestions(string surveyId)
        {
            return GetQuestionsFromSurveyAndLayout(_publishingService.GetUnpublishedVersion(surveyId));
        }

        public List<QuestionDefinition> GetReportQuestions(string surveyId, bool isTesting)
        {
            if (!isTesting && !_publishingService.IsPublished(surveyId)) return new List<QuestionDefinition>();
            return isTesting ? GetUnpublishedVersionQuestions(surveyId) : GetLatestVersionQuestions(surveyId);
        }

        private List<QuestionDefinition> GetQuestionsFromSurveyAndLayout(SurveyAndLayout surveyAndLayout)
        {
            var nodes = surveyAndLayout.Survey.TopFolder.ChildNodes;
            var questions = new List<QuestionDefinition>();
            foreach (var node in nodes)
            {
                var pageDefinition = node as PageDefinition;
                if (pageDefinition != null)
                    questions.AddRange(pageDefinition.QuestionDefinitions.Where(question => !(question is InformationDefinition)));
            }

            return questions;
        }

        public QuestionType GetQuestionType(QuestionDefinition questionDefinition)
        {
            //TODO need to refactor this function
            //Now it cannot detect Picture question
            var gridQuestionDefinition = questionDefinition as GridQuestionDefinition;
            if (gridQuestionDefinition != null)
            {
                if (gridQuestionDefinition is SingleSelectionGridQuestionDefinition) return QuestionType.SingleSelectionGridQuestionDefinition;
                if (gridQuestionDefinition is MultipleSelectionGridQuestionDefinition) return QuestionType.MultipleSelectionGridQuestionDefinition;
                if (gridQuestionDefinition is ShortTextListQuestionDefinition) return QuestionType.ShortTextListQuestionDefinition;
                if (gridQuestionDefinition is LongTextListQuestionDefinition) return QuestionType.LongTextListQuestionDefinition;
                if (gridQuestionDefinition is ScaleGridQuestionDefinition) return QuestionType.ScaleGridQuestionDefinition;
                if (gridQuestionDefinition is RatingGridQuestionDefinition) return QuestionType.RatingGridQuestionDefinition;
            }

            var singleSelectionQuestionDefinition = questionDefinition as SingleSelectionQuestionDefinition;
            if (singleSelectionQuestionDefinition != null)
            {
                if (singleSelectionQuestionDefinition is NetPromoterScoreQuestionDefinition) return QuestionType.NetPromoterScoreQuestionDefinition;
                if (singleSelectionQuestionDefinition is ScaleQuestionDefinition) return QuestionType.ScaleQuestionDefinition;
                return QuestionType.SingleSelectionQuestionDefinition;
            }

            if (questionDefinition is MultipleSelectionQuestionDefinition) return QuestionType.MultipleSelectionQuestionDefinition;
            if (questionDefinition is OpenEndedShortTextQuestionDefinition) return QuestionType.OpenEndedShortTextQuestionDefinition;
            if (questionDefinition is OpenEndedLongTextQuestionDefinition) return QuestionType.OpenEndedLongTextQuestionDefinition;
            if (questionDefinition is NumericQuestionDefinition) return QuestionType.NumericQuestionDefinition;
            if (questionDefinition is RatingQuestionDefinition) return QuestionType.RatingQuestionDefinition;
            if (questionDefinition is DateQuestionDefinition) return QuestionType.DateQuestionDefinition;

            return QuestionType.InformationDefinition;
        }

        public List<Option> GetExpandedOptions(List<QuestionDefinition> questions, IEnumerable<Option> options)
        {
            var expandedOptions = new List<Option>();
            foreach (var option in options)
            {
                if (option.OptionsMask.QuestionId!=null)
                {
                    var questionDefinitionWithOptions = questions.SingleOrDefault(q => q.Id == option.OptionsMask.QuestionId) as QuestionWithOptionsDefinition;
                    if (questionDefinitionWithOptions != null)
                    {
                        expandedOptions.AddRange(GetExpandedOptions(questions, questionDefinitionWithOptions.OptionList.Options));
                    }
                }
                else
                {
                    expandedOptions.Add(option);
                }
            }
            return expandedOptions;
        }

        public List<Option> GetQuestionOptions(QuestionDefinition question)
        {
            var singleSelectionQuestion = question as SingleSelectionQuestionDefinition;
            if (singleSelectionQuestion?.OptionList != null)
            {
                return singleSelectionQuestion.OptionList.Options.ToList();
            }

            var multipleSelectionQuestion = question as MultipleSelectionQuestionDefinition;
            if (multipleSelectionQuestion?.OptionList != null)
            {
                return multipleSelectionQuestion.OptionList.Options.ToList();
            }

            var gridQuestionDefinition = question as GridQuestionDefinition;
            if (gridQuestionDefinition != null)
            {
                var subQuestionAsSingleSelectionQuestion = gridQuestionDefinition.SubQuestionDefinition as SingleSelectionQuestionDefinition;
                if (subQuestionAsSingleSelectionQuestion?.OptionList != null)
                {
                    return subQuestionAsSingleSelectionQuestion.OptionList.Options.ToList();
                }
                var subQuestionAsMultipleSelectionQuestion = gridQuestionDefinition.SubQuestionDefinition as MultipleSelectionQuestionDefinition;
                if (subQuestionAsMultipleSelectionQuestion?.OptionList != null)
                {
                    return subQuestionAsMultipleSelectionQuestion.OptionList.Options.ToList();
                }
                var subQuestionAsRatingQuestion = gridQuestionDefinition.SubQuestionDefinition as RatingQuestionDefinition;
                if (subQuestionAsRatingQuestion?.OptionList != null)
                {
                    return subQuestionAsRatingQuestion.OptionList.Options.ToList();
                }
            }

            return new List<Option>();
        }

        public List<Option> GetQuestionTopics(QuestionDefinition question)
        {
            var gridQuestionDefinition = question as GridQuestionDefinition;
            if (gridQuestionDefinition != null && gridQuestionDefinition.OptionList != null)
            {
                return gridQuestionDefinition.OptionList.Options.ToList();
            }

            return new List<Option>();
        }

        public bool IsSelectionGridQuestion(GridQuestionDefinition gridQuestionDefinition)
        {
            return gridQuestionDefinition is SingleSelectionGridQuestionDefinition ||
                   gridQuestionDefinition is MultipleSelectionGridQuestionDefinition ||
                   gridQuestionDefinition is ShortTextListQuestionDefinition ||
                   gridQuestionDefinition is LongTextListQuestionDefinition ||
                   gridQuestionDefinition is ScaleGridQuestionDefinition ||
                   gridQuestionDefinition is RatingGridQuestionDefinition;
        }
    }
}