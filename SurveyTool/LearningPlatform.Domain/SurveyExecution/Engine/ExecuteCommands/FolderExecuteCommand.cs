using System;
using System.Collections.Generic;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.FlowLogic;
using LearningPlatform.Domain.SurveyExecution.ResponseRows;

namespace LearningPlatform.Domain.SurveyExecution.Engine.ExecuteCommands
{
    public class FolderExecuteCommand : IExecuteCommand
    {
        private readonly LoopService _loopService;

        public FolderExecuteCommand(LoopService loopService)
        {
            _loopService = loopService;
        }

        public void Execute(Node node, NodeCursor cursor)
        {
            var folder = (Folder)node;
            if (folder.Loop == null) 
            {
                cursor.MoveToFolder(folder);
                return;
            }
            HandleLoop(cursor, folder);
        }

        private void HandleLoop(NodeCursor cursor, Folder folder)
        {
            LoopDefinition loop = folder.Loop;
            IList<string> aliases = _loopService.GetMaskedAliases(loop);
            if (aliases.Count == 0)
            {
                if (cursor.DoNotSkipPage)                    
                {
                    // In the "do not skip page mode" we do not want to skip the loop even if it has no loop iterations so we just navigate the folder to return the first page of the folder.
                    cursor.MoveToFolder(folder);
                    return;
                }
                cursor.Move();
                return;
            }
            LoopState loopState = _loopService.GetLoopState();
            LoopStateItem loopStateItem = loopState.GetCurrentItem(folder.Alias);
            int index;
            if (loopStateItem == null)
            {
                index = cursor.Direction == Direction.Forward ? 0 : aliases.Count - 1;
                loopStateItem = new LoopStateItem
                {
                    LoopAlias = folder.Alias,
                    OptionAlias = aliases[index]
                };
                loopState.Items.Add(loopStateItem);
            }
            else
            {
                index = aliases.IndexOf(loopStateItem.OptionAlias) + cursor.Increment;
            }

            if (index >= aliases.Count || index < 0)
            {
                loopState.Items.Remove(loopStateItem);
                cursor.Move();
                return;
            }
            loopStateItem.OptionAlias = aliases[index];
            cursor.MoveToFolder(folder);
        }

        public Type TypeFor { get { return typeof(Folder); } }
    }
}