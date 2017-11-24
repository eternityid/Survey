using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign.Pages;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyExecution.Request;
using LearningPlatform.Domain.SurveyExecution.Scripting;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;

namespace LearningPlatform.Domain.SurveyExecution.Questions
{
    public class QuestionFactory : IQuestionFactory
    {
        private readonly IRequestContext _requestContext;
        private readonly IScriptExecutor _scriptExecutor;
        private readonly ExpressionQueryBuilder _expressionQueryBuilder;
        private readonly MapperService _mapper;

        public QuestionFactory(IRequestContext requestContext, IScriptExecutor scriptExecutor, ExpressionQueryBuilder expressionQueryBuilder, MapperService mapper)
        {
            _requestContext = requestContext;
            _scriptExecutor = scriptExecutor;
            _expressionQueryBuilder = expressionQueryBuilder;
            _mapper = mapper;
        }

        public Question CreateQuestion(string questionId)
        {
            return CreateQuestion(_requestContext.NodeService.GetQuestionDefinitionByAlias(questionId), new NameValueCollection());
        }

        public Question CreateQuestion(QuestionDefinition questionDefinition, NameValueCollection form)
        {
            var question = _mapper.Map<Question>(questionDefinition);
            question.ListItemAlias = null;

            HideQuestion(questionDefinition, question);

            question.Initialize(form);
            return question;
        }

        private void HideQuestion(QuestionDefinition questionDefinition, Question question)
        {
            question.Hidden = questionDefinition.IsAlwaysHidden ? questionDefinition.IsAlwaysHidden : IsMatchQuestionMask(questionDefinition);
            if (question.Hidden)
            {
                _requestContext.State.QuestionAliasesToClean.Add(question.Alias);
            }
        }

        private bool IsMatchQuestionMask(QuestionDefinition questionDefinition)
        {
            string questionMask = questionDefinition.QuestionMask;
            if (string.IsNullOrEmpty(questionMask) && questionDefinition.QuestionMaskExpression != null)
            {
                questionMask = _expressionQueryBuilder.Build(questionDefinition.QuestionMaskExpression.GetItems());
            }

            if (!string.IsNullOrEmpty(questionMask))
            {
                return !_scriptExecutor.EvaluateCode<bool>(questionMask);
            }
            return false;
        }

        public IList<Question> CreateQuestionsForPage(PageDefinition pageDefinition, NameValueCollection form)
        {
            var ordered = pageDefinition.QuestionDefinitions.OrderBy(p => p.Position).ToList();

            return ordered.Select(questionDefinition => CreateQuestion(questionDefinition, form)).ToList();
        }


    }
}