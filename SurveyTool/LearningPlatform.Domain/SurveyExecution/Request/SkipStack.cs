using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace LearningPlatform.Domain.SurveyExecution.Request
{
    public class SkipStack
    {
        public SkipStack()
        {
            Items = new Stack<SkipPoint>();
        }

        public Stack<SkipPoint> Items { get; private set; }

        public static SkipStack Create(string stack)
        {
            var nodeIds = stack.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).ToArray();
            var skipStack = new SkipStack();
            for (int i = 0; i < nodeIds.Length; i += 2)
            {
                skipStack.Items.Push(new SkipPoint {NodeId = nodeIds[i], ReturnNodeId = nodeIds[i + 1]});
            }
            return skipStack;
        }

        public override string ToString()
        {
            var values = new List<string>();
            foreach (var skipPoint in Items)
            {
                values.Add(skipPoint.NodeId);
                values.Add(skipPoint.ReturnNodeId);
            }
            return string.Join(",", values);
        }
    }
}