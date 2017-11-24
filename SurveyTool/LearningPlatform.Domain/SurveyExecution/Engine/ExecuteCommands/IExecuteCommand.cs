using System;
using LearningPlatform.Domain.SurveyDesign;

namespace LearningPlatform.Domain.SurveyExecution.Engine.ExecuteCommands
{
    public interface IExecuteCommand
    {
        void Execute(Node node, NodeCursor cursor);
        Type TypeFor { get; }
    }
}