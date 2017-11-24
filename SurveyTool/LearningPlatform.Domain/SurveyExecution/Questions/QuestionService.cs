using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyExecution.RepositoryContracts;
using LearningPlatform.Domain.SurveyExecution.Request;
using LearningPlatform.Domain.SurveyExecution.ResponseRows;
using Microsoft.Ajax.Utilities;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;

namespace LearningPlatform.Domain.SurveyExecution.Questions
{
    public class QuestionService : IQuestionService
    {
        private readonly IResponseRowRepository _responseRowRepository;
        private readonly IRequestContext _requestContext;
        private readonly IQuestionFactory _questionFactory;
        private readonly IResponseRowFactory _responseRowFactory;

        public QuestionService(IResponseRowRepository responseRowRepository,
            IRequestContext requestContext,
            IQuestionFactory questionFactory,
            IResponseRowFactory responseRowFactory)
        {
            _responseRowRepository = responseRowRepository;
            _requestContext = requestContext;
            _questionFactory = questionFactory;
            _responseRowFactory = responseRowFactory;
        }

        public IList<Question> GetQuestionsWithAnswers(IList<string> questionAliases)
        {
            var requestState = _requestContext.State;
            var customColumnsData = _requestContext.Respondent != null &&
                        _requestContext.Respondent.CustomColumns != null ?
                        JsonConvert.DeserializeObject<JObject>(_requestContext.Respondent.CustomColumns) :
                        null;

            var questions = new List<Question>();

            var questionsToAddResponseRows = new List<Question>();
            foreach (var questionAlias in questionAliases)
            {
                if (requestState.Questions.ContainsKey(questionAlias))
                {
                    var question = requestState.Questions[questionAlias];
                    questions.Add(question);
                }
                else
                {
                    var question = _questionFactory.CreateQuestion(questionAlias);

                    SetQuestionAnswerByCustomColumnsData(customColumnsData, question);

                    questions.Add(question);
                    requestState.Questions[question.Alias] = question;
                    questionsToAddResponseRows.Add(question);
                }
            }

            if (questionsToAddResponseRows.Any())
            {
                AddResponseRowsToQuestions(questionsToAddResponseRows, _requestContext);
            }

            return questions;
        }

        private void SetQuestionAnswerByCustomColumnsData(JObject customColumnsData, Question question)
        {
            if (customColumnsData == null || customColumnsData[question.Alias] == null) return;
            if (question is OpenEndedTextQuestion || question is NumericQuestion)
                question.Answer = _requestContext.CustomColumns[question.Alias].ToString();
        }

        private void AddResponseRowsToQuestions(IEnumerable<Question> questions, IRequestContext requestContext)
        {
            var expandedQuestions = GetExpandedQuestions(questions);

            var currentRespondent = requestContext.Respondent;
            var rows = _responseRowRepository.GetRows(expandedQuestions.ToList(), currentRespondent.Id, requestContext.Survey.Id);


            IDictionary<string, Question> questionDictionary = expandedQuestions.DistinctBy(x => x.Alias).ToDictionary(q => q.Alias);
            foreach (var row in rows)
            {
                var loopPosition = (LoopState)requestContext.State.LoopState.Clone();
                while (true)
                {
                    if (loopPosition.ToString() == row.LoopState.ToString())
                    {
                        var question = questionDictionary[row.QuestionName];
                        question.AddAnswer(row);
                        break;
                    }
                    if (!loopPosition.Items.Any())
                    {
                        break;
                    }
                    loopPosition.Items.Remove(loopPosition.Items.Last());
                }
            }
        }

        public IList<Question> GetExpandedQuestions(IEnumerable<Question> questions)
        {
            var expandedQuestions = new List<Question>();
            foreach (var question in questions)
            {
                expandedQuestions.AddRange(question.GetQuestions());
                var questionWithOptions = question as QuestionWithOptions;
                if (questionWithOptions != null)
                {
                    expandedQuestions.AddRange(
                        questionWithOptions.GetOtherQuestions().Select(otherQuestion => otherQuestion.Question));
                }
            }
            return expandedQuestions;
        }

        public Question GetQuestion(string questionId)
        {
            return GetQuestionsWithAnswers(new List<string> { questionId }).First();
        }

        public void SaveQuestion(Question question)
        {
            SaveQuestions(new List<Question> { question });
        }

        public void SaveQuestions(ICollection<Question> questions)
        {
            LanguageSelectionQuestion languageSelectionQuestion = questions.OfType<LanguageSelectionQuestion>().FirstOrDefault();
            if (languageSelectionQuestion != null) _requestContext.Respondent.Language = languageSelectionQuestion.SingleAnswer;
            var rows = _responseRowFactory.CreateResponseRows(_requestContext.Survey.Id, _requestContext.Respondent.Id, _requestContext.State.LoopState, questions);
            _responseRowRepository.Update(rows);
        }

        public void CleanQuestions(IList<string> questionIds)
        {
            foreach (var questionId in questionIds)
            {
                _requestContext.State.Questions.Remove(questionId);
            }
            _responseRowRepository.Delete(questionIds, _requestContext.Respondent.Id, _requestContext.Survey.Id);
        }
    }
}