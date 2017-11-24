//TODO: Check this dependency

using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyExecution.ResponseRows;
using LearningPlatform.Domain.SurveyExecution.TableLayout;
using LearningPlatform.Domain.SurveyExecution.Validators;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;

namespace LearningPlatform.Domain.SurveyExecution.Questions
{
    public abstract class Question : IFixedPosition
    {
        protected Question()
        {
            Commands = new List<ResponseRowFactoryCommand>();
            Errors = new List<QuestionError>();
        }

        protected List<ResponseRowFactoryCommand> Commands { get; }

        public T Command<T>() where T : ResponseRowFactoryCommand
        {
            return (T)Commands.FirstOrDefault(c => c is T);
        }

        protected string GetNameWithListId()
        {
            return ListItemAlias != null ? $"{Alias}_{ListItemAlias}" : Alias;
        }


        public EvaluationString TitleEvaluationString { get; set; }
        public EvaluationString DescriptionEvaulationString { get; set; }
        public string ListItemAlias { get; set; }

        public string Alias { get; set; }

        public string Description => DescriptionEvaulationString?.ToString() ?? "";

        public string Title => TitleEvaluationString?.ToString() ?? "";

        public abstract void RenderGridCell(Table table);
        public abstract object Answer { get; set; }
        public abstract List<int> Mask { get; set; }
        public IList<QuestionError> Errors { get; set; }
        public IList<string> ErrorStrings => Errors.Select(p => p.Message).ToList();

        public IList<QuestionValidator> Validators { get; set; }
        public bool Hidden { get; set; }


        public abstract void AddAnswer(ResponseRow row);

        public virtual IEnumerable<Question> GetQuestions()
        {
            return new List<Question> { this };
        }

        public virtual void Initialize(NameValueCollection form)
        {
            Alias = GetNameWithListId();
        }

        public bool IsRequired
        {
            get
            {
                return Validators.Any(validator => validator.GetType() == typeof(RequiredValidator));
            }
        }

        public bool IsRenderOptionByButton
        {
            get
            {
                var singleSelectionQuestion = this as SingleSelectionQuestion;
                return singleSelectionQuestion != null && singleSelectionQuestion.RenderOptionByButton;
            }
        }

        public bool IsTransposed
        {
            get
            {
                var gridQuestion = this as GridQuestion;
                return gridQuestion != null && gridQuestion.Transposed;
            }
        }

        public bool IsFixedPosition
        {
            get; set;
        }

        public string Type { get; set; }
    }
}