using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Domain.SurveyDesign.Questions
{
    public abstract class QuestionWithOptionsDefinition : QuestionDefinition, IHasOptions
    {
        private OrderType _orderType;
        private int _seed;
        private bool? _containsExclusiveOption;


        protected QuestionWithOptionsDefinition()
        {
            OptionsMask = new OptionsMask();
        }

        public IList<Option> GetOptions()
        {
            return ParentQuestion != null ? ParentQuestion.GetOptions() : OptionList?.Options;
        }

        public bool ContainsExclusiveOption
        {
            get
            {
                if (_containsExclusiveOption.HasValue)
                {
                    return _containsExclusiveOption.Value;
                }

                var options = GetOptions();
                if (options != null && options.Any(option => option.IsNotApplicable || option.IsExclusive))
                {
                    _containsExclusiveOption = true;
                    return true;
                }
                return false;
            }
        }

        public OptionList OptionList { get; set; }

        [JsonIgnore]
        public string OptionListId { get; set; }
        public OrderType OrderType
        {
            get { return ParentQuestion?.OrderType ?? _orderType; }
            set { _orderType = value; }
        }

        public int Seed
        {
            get { return ParentQuestion?.Seed ?? _seed; }
            set { _seed = value; }
        }

        public DisplayOrientation DisplayOrientation { get; set; }

        public bool IsInGrid => ParentQuestion != null;

        [JsonIgnore]
        public MatrixQuestionDefinition ParentQuestion { get; set; }

        public OptionsMask OptionsMask { get; set; }

        public IEnumerable<QuestionDefinition> FindOtherQuestions()
        {
            return GetOptions()
                .Where(option => option.OtherQuestionDefinition != null)
                .Select(option => option.OtherQuestionDefinition).ToList();
        }


        public void SetParentMatrixQuestionDefinition(MatrixQuestionDefinition matrixQuestionDefinition)
        {
            ParentQuestion = matrixQuestionDefinition;
        }
    }
}