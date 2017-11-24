using Elasticsearch.Net;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Services;
using System.Collections.Generic;

namespace LearningPlatform.Domain.Reporting.Respondents
{
    public class AggregatedQuestionFactory
    {
        private readonly AggregatedSelectionGridQuestionFactory _aggregatedSelectionGridQuestionFactory;
        private readonly AggregatedOptionQuestionFactory _aggregatedOptionQuestionFactory;
        private readonly AggregatedNumericQuestionFactory _aggregatedNumericQuestionFactory;
        private readonly AggregatedOpenQuestionFactory _aggregatedOpenQuestionFactory;
        private readonly ReadQuestionService _readQuestionService;

        public AggregatedQuestionFactory(AggregatedSelectionGridQuestionFactory aggregatedSelectionGridQuestionFactory, AggregatedOptionQuestionFactory aggregatedOptionQuestionFactory,
            AggregatedNumericQuestionFactory aggregatedNumericQuestionFactory, AggregatedOpenQuestionFactory aggregatedOpenQuestionFactory,
            ReadQuestionService readQuestionService)
        {
            _aggregatedSelectionGridQuestionFactory = aggregatedSelectionGridQuestionFactory;
            _aggregatedOptionQuestionFactory = aggregatedOptionQuestionFactory;
            _aggregatedNumericQuestionFactory = aggregatedNumericQuestionFactory;
            _aggregatedOpenQuestionFactory = aggregatedOpenQuestionFactory;
            _readQuestionService = readQuestionService;
        }

        public AggregatedQuestion CreateAggregatedQuestion(QuestionDefinition questionDefinition, ElasticsearchResponse<dynamic> aggregationsRespondentsResult,
            ElasticsearchResponse<dynamic> aggregationsCountRespondentsResult, List<QuestionDefinition> questionDefinitions)
        {
            AggregatedQuestion aggregatedQuestion;
            var questionType = _readQuestionService.GetQuestionType(questionDefinition);
            switch (questionType)
            {
                case QuestionType.MultipleSelectionGridQuestionDefinition:
                case QuestionType.SingleSelectionGridQuestionDefinition:
                case QuestionType.RatingGridQuestionDefinition:
                case QuestionType.ScaleGridQuestionDefinition:
                    aggregatedQuestion = _aggregatedSelectionGridQuestionFactory
                        .CreateAggregatedMultipleSelectionGridQuestion(
                            questionDefinition as GridQuestionDefinition, aggregationsRespondentsResult, aggregationsCountRespondentsResult, questionDefinitions);
                    break;

                case QuestionType.NetPromoterScoreQuestionDefinition:
                case QuestionType.ScaleQuestionDefinition:
                case QuestionType.SingleSelectionQuestionDefinition:
                case QuestionType.MultipleSelectionQuestionDefinition:
                case QuestionType.RatingQuestionDefinition:
                    aggregatedQuestion = _aggregatedOptionQuestionFactory.CreateAggregatedOptionQuestion(
                        questionDefinition as QuestionWithOptionsDefinition, aggregationsRespondentsResult, questionDefinitions);
                    break;

                case QuestionType.NumericQuestionDefinition:
                    aggregatedQuestion =
                        _aggregatedNumericQuestionFactory.CreateAggregatedNumericQuestion(questionDefinition as NumericQuestionDefinition,
                            aggregationsRespondentsResult, aggregationsCountRespondentsResult);
                    break;

                default:
                    aggregatedQuestion = _aggregatedOpenQuestionFactory.CreateAggregatedOpenQuestion(questionDefinition,
                        aggregationsCountRespondentsResult);
                    break;
            }

            aggregatedQuestion.Id = questionDefinition.Id;
            aggregatedQuestion.QuestionName = questionDefinition.Alias;
            aggregatedQuestion.QuestionType = (short)_readQuestionService.GetQuestionType(questionDefinition);
            aggregatedQuestion.QuestionText = questionDefinition.Title.GetFirstItemText();

            return aggregatedQuestion;
        }
    }
}
