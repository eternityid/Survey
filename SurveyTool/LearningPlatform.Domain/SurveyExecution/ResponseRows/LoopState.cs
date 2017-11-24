using System;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Domain.SurveyExecution.ResponseRows
{
    public class LoopState : ICloneable
    {
        public LoopState()
        {
            Items = new List<LoopStateItem>();
        }

        public static LoopState Create(string val)
        {
            if (string.IsNullOrEmpty(val)) return new LoopState();

            var ret = new LoopState();
            var itemStrings = val.Split(new[] {','}, StringSplitOptions.None);
            foreach (string itemString in itemStrings)
            {
                ret.Items.Add(LoopStateItem.Create(itemString));
            }
            return ret;
        }

        public LoopStateItem GetCurrentItem(string loopAlias)
        {
            return Items.Find(p => p.LoopAlias == loopAlias);
        }

        public List<LoopStateItem> Items { get; private set; }

        public override string ToString()
        {
            var itemStrings = Items.Select(item => item.ToString());
            return string.Join(",", itemStrings);

        }

        public string Value
        {
            get { return ToString(); }
            set { Items = Create(value).Items; }
        }

        public object Clone()
        {
            return Create(ToString());
        }
    }
}