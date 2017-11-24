using System;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.FlowLogic;

namespace LearningPlatform.Domain.SurveyExecution.Engine.ExecuteCommands
{
    public class GoToFolderExecuteCommand : IExecuteCommand
    {
        public void Execute(Node node, NodeCursor cursor)
        {
            cursor.PushGotoReturnState();
            cursor.MoveToFolder(((GoToFolder)node).GoToFolderNode);
        }

        public Type TypeFor { get { return typeof (GoToFolder); } }
    }
}