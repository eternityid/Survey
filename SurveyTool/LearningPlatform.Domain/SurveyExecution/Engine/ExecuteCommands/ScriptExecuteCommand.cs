using System;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyExecution.Scripting;

namespace LearningPlatform.Domain.SurveyExecution.Engine.ExecuteCommands
{
    public class ScriptExecuteCommand : IExecuteCommand
    {
        private readonly IScriptExecutor _scriptExecutor;

        public ScriptExecuteCommand(IScriptExecutor scriptExecutor)
        {
            _scriptExecutor = scriptExecutor;
        }

        public void Execute(Node node, NodeCursor cursor)
        {
            _scriptExecutor.EvaluateCode(((Script)node).ScriptCode);
            cursor.Move();
        }

        public Type TypeFor { get { return typeof(Script); } }
    }
}