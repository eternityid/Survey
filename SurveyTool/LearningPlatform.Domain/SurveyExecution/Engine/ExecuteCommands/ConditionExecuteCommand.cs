using System;
using System.Linq;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.FlowLogic;
using LearningPlatform.Domain.SurveyExecution.Request;
using LearningPlatform.Domain.SurveyExecution.Scripting;

namespace LearningPlatform.Domain.SurveyExecution.Engine.ExecuteCommands
{
    public class ConditionExecuteCommand : IExecuteCommand
    {
        private readonly IScriptExecutor _scriptExecutor;
        private readonly IRequestContext _requestContext;

        public ConditionExecuteCommand(IScriptExecutor scriptExecutor, IRequestContext requestContext)
        {
            _scriptExecutor = scriptExecutor;
            _requestContext = requestContext;
        }

        public void Execute(Node node, NodeCursor cursor)
        {
            var condition = (Condition) node;
            if (_scriptExecutor.EvaluateCode<bool>(condition.ScriptCodeExpression))
            {
                DataClean(condition.FalseFolder);
                cursor.MoveToFolder(condition.TrueFolder);
                return;
            }
            DataClean(condition.TrueFolder);
            if (condition.FalseFolder != null)
            {
                cursor.MoveToFolder(condition.FalseFolder);
                return;
            }
            cursor.Move();
        }

        public Type TypeFor { get { return typeof(Condition); } }

        private RequestState RequestState
        {
            get { return _requestContext.State; }
        }

        private void DataClean(Folder folder)
        {
            if (folder == null)
                return;

            RequestState.QuestionAliasesToClean.AddRange(folder.QuestionAliases.ToList());
        }
    }
}