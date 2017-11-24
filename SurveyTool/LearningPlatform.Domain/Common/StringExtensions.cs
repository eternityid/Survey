using System;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Domain.Common
{
    public static class StringExtensions
    {
        public static int IndexOfAny(this string s, string[] delims, int start, out string delimiterFound)
        {
            var ret = int.MaxValue;
            delimiterFound = null;
            foreach (var delim in delims)
            {
                var indexOf = s.IndexOf(delim, start, StringComparison.Ordinal);
                if (indexOf != -1 && indexOf<ret)
                {
                    ret = indexOf;
                    delimiterFound = delim;
                }
            }
            return ret==int.MaxValue?-1:ret;
        }

        public static string[] SplitAndKeep(this string s, IEnumerable<string> delims)
        {
            var sorted = delims.OrderByDescending(p => p.Length).ToArray();
            return SplitAndKeep(s, sorted).ToArray();
        }


        private static IEnumerable<string> SplitAndKeep(string s, string[] delims)
        {
            int start = 0;
            int index;
            string delimiterFound;
            while ((index = s.IndexOfAny(delims, start, out delimiterFound)) != -1)
            {
                if (index - start > 0)
                    yield return s.Substring(start, index - start);
                yield return s.Substring(index, delimiterFound.Length);
                start = index + delimiterFound.Length;
            }

            if (start < s.Length)
            {
                yield return s.Substring(start);
            }
        }
    }
}