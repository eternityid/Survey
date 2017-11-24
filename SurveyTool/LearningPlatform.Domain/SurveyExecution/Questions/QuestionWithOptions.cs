using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using AutoMapper;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyExecution.Options;
using LearningPlatform.Domain.SurveyExecution.TableLayout;

namespace LearningPlatform.Domain.SurveyExecution.Questions
{
    public abstract class QuestionWithOptions : Question, IOptions
    {
        protected QuestionWithOptions()
        {
        }

        public override void Initialize(NameValueCollection form)
        {
            base.Initialize(form);
            foreach (var otherQuestion in GetOtherQuestions())
            {
                otherQuestion.Initialize(form);
            }
        }

        public DisplayOrientation DisplayOrientation { get; set; }

        [IgnoreMap]
        public IList<Option> Options { get; set; }


        public List<OtherQuestion> GetOtherQuestions()
        {
            return Options
                .Where(option => option.OtherQuestion != null)
                .Select(option => new OtherQuestion
                {
                    Question = option.OtherQuestion,
                    Option = option,
                    ParentQuestion = this
                }).ToList();
        }


        public abstract void RenderGrid(Table table);
    }
}