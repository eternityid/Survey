using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using LearningPlatform.Domain.SurveyExecution.Options;
using LearningPlatform.Domain.SurveyExecution.ResponseRows;
using LearningPlatform.Domain.SurveyExecution.Scripting;

namespace LearningPlatform.Domain.SurveyExecution.Questions
{
    public class MultipleSelectionAnswer : ISelectableQuestion
    {
        private readonly IDictionary<string, bool> _answer;

        public MultipleSelectionAnswer() : this(new Dictionary<string, bool>())
        {
        }

        private MultipleSelectionAnswer(IDictionary<string, bool> answers)
        {
            _answer = answers;
        }

        public IDictionary<string, bool> Items
        {
            get { return _answer; }
        }

        public int Count
        {
            get { return _answer.Count; }
        }

        public void AddAnswer(string code, bool isChecked)
        {
            if (_answer.ContainsKey(code)) throw new ArgumentException("Alias was already added to the collection");

            _answer.Add(code, isChecked);
        }

        public void AddAnswer(ResponseRow row)
        {
            if (row.AnswerType != AnswerType.Multi) throw new InvalidOperationException("Unexpected answer type on ResponseRow");
            if (row.Alias == null) throw new InvalidOperationException("Alias was not set on ResponseRow");

            _answer[row.Alias] = row.IntegerAnswer == 1; //consider bit
        }

        public bool IsChecked(Option option)
        {
            return _answer.ContainsKey(option.Alias) && _answer[option.Alias];
        }


        public List<string> CheckedItems
        {
            get
            {
                return (from item in Items where item.Value select item.Key).ToList();
            }
        }

        public static MultipleSelectionAnswer Create(object value)
        {
            if (value == null) return new MultipleSelectionAnswer();

            var multipleSelection = value as MultipleSelectionAnswer;
            if (multipleSelection != null) return multipleSelection;

            var dynamic = value as DynamicObject;
            if (dynamic!=null)
            {
                var stringList = StringListConverter.ToStringList(dynamic);
                return new MultipleSelectionAnswer(stringList.ToDictionary(item => item, item => true));
            }


            var val = value as IDictionary<string, object>;
            if (val != null) return new MultipleSelectionAnswer(val.ToDictionary(item => item.Key, item => (bool)item.Value));

            var dictionary = value as IDictionary<string, bool>;
            if(dictionary!=null) return new MultipleSelectionAnswer(dictionary);

       
            return new MultipleSelectionAnswer();
        }
    }
}