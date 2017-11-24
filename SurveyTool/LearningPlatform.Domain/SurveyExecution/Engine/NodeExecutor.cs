using System;
using System.Collections.Generic;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyExecution.Engine.ExecuteCommands;

namespace LearningPlatform.Domain.SurveyExecution.Engine
{
    public class NodeExecutor : INodeExecutor
    {
        private readonly Dictionary<Type, IExecuteCommand> _executeCommands;


        public NodeExecutor(ConditionExecuteCommand conditionExecuteCommand,
            GoToFolderExecuteCommand goToFolderExecuteCommand,
            FolderExecuteCommand folderExecuteCommand,
            ScriptExecuteCommand scriptExecuteCommand)
        {
            _executeCommands = new Dictionary<Type, IExecuteCommand>();
            ConfigureExecuteCommands(
                conditionExecuteCommand,
                goToFolderExecuteCommand,
                folderExecuteCommand,
                scriptExecuteCommand);

        }


        private void ConfigureExecuteCommands(params IExecuteCommand[] commands)
        {
            foreach (var command in commands)
            {
                _executeCommands[command.TypeFor] = command;
            }
        }

        public void Execute(Node node, NodeCursor cursor)
        {
            IExecuteCommand command;
            if (_executeCommands.TryGetValue(node.GetType(), out command))
            {
                command.Execute(node, cursor);
            }
        }


 
    }
}