using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyExecution.Questions;
using LearningPlatform.Domain.SurveyExecution.Security;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Serialization;

namespace LearningPlatform.Domain.SurveyExecution
{
    public class Page : IFixedPosition
    {
        private readonly IList<Question> _questions;
        private List<string> _mask;
        private ProtectedVariables _protectedVariables;
        private IList<Question> _questionsWithOrder;

        public Page(IList<Question> questions)
        {
            _questions = questions;
            Errors = new List<QuestionError>();
        }

        public EvaluationString Title { get; set; }
        public EvaluationString Description { get; set; }


        public OrderType OrderType { get; set; }
        public int Seed { get; set; }

        [JsonProperty(TypeNameHandling = TypeNameHandling.None)]
        public IList<Question> Questions
        {
            get
            {
                return _questionsWithOrder ??
                       (_questionsWithOrder =
                           new OrderedList<Question>(OrderType, _questions,
                               (int)(GetUnprotectedVariables().RespondentId + Seed))).Where(
                                   question => Mask == null || Mask.Contains(question.Alias)).ToList();
            }
        }

        public int Progress { get; set; }

        public NavigationButtons NavigationButtons { get; set; }

        public bool DisplayPrevious => NavigationButtons == NavigationButtons.PreviousAndNext ||
                                       NavigationButtons == NavigationButtons.PreviousAndFinish ||
                                       NavigationButtons == NavigationButtons.Previous;

        public bool DisplayNext => NavigationButtons == NavigationButtons.PreviousAndNext ||
                                   NavigationButtons == NavigationButtons.Next;

        public bool DisplayFinish => NavigationButtons == NavigationButtons.PreviousAndFinish ||
                                     NavigationButtons == NavigationButtons.Finish;


        /// <summary>
        /// Important! Should not serialize this because the content is sensitive from a security perceptive.
        /// This is why a method is used instead of a property.
        /// </summary>
        private ProtectedVariables GetUnprotectedVariables()
        {
            return _protectedVariables ?? (_protectedVariables = VariablesProtector.Unprotect(Context));
        }

        /// <summary>
        /// Should not be serialized. This is why a method is used instead of a property.
        /// </summary>
        public string GetPageId()
        {
            return GetUnprotectedVariables().PageId;
        }

        /// <summary>
        ///     Security context
        /// </summary>
        public string Context { get; set; }


        public List<string> Mask
        {
            get { return _mask; }
            set
            {
                _mask = value;
                _questionsWithOrder = null;
            }
        }

        public IList<QuestionError> Errors { get; set; }
        public IList<string> ErrorStrings => Errors.Select(p => p.Message).ToList();
        public EvaluationString PreviousButtonText { get; set; }
        public EvaluationString NextButtonText { get; set; }
        public EvaluationString FinishButtonText { get; set; }
        public bool KeyboardSupport { get; set; }

        public bool DisplayOneQuestionOnScreen { get; set; }
        public bool DisplayProgressBar { get; set; }

        public bool IsFixedPosition { get; set; }
        
        //Metadata for View
        public bool IsDynamicPage { get; set; }

        public bool HasSkipActions { get; set; }

	    public string SerializedQuestions
	    {
		    get
		    {
			    var questionObjects = Questions.Select(question =>
				    new
				    {
					    question.Alias,
					    question.Title,
					    question.Validators,
					    question.Errors,
					    QuestionType = question.Type
				    }).ToList();
			   return JsonConvert.SerializeObject(questionObjects, new JsonSerializerSettings
			   {
				   ContractResolver = new CamelCasePropertyNamesContractResolver()
			   });
			}
	    }
    }
}