using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace LearningPlatform.Domain.SurveyExecution.Request
{
    public class GoToFolderStack
    {
        public GoToFolderStack()
        {
            Items = new Stack<string>();
        }

        public Stack<string> Items { get; private set; }
        
        public static GoToFolderStack Create(string stack)
        {
            var gotoIds = stack.Split(new[] {","}, StringSplitOptions.RemoveEmptyEntries);
            var gotoStack = new GoToFolderStack();
            foreach (var id in gotoIds)
            {
                gotoStack.Items.Push(id);
            }
            return gotoStack;
        }

        public override string ToString()
        {
            return String.Join(",", Items.Select(surveyPoint => surveyPoint).ToList());
        }
    }
}