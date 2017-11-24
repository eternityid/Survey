using System.Collections;
using System.Collections.Generic;

namespace LearningPlatform.TestFramework
{
    public static class ComparerExtensions
    {
        public static IComparer ToComparer<T>(this IComparer<T> comparer) where T : class
        {
            return new ComparerWrapper<T>(comparer);
        }

        private class ComparerWrapper<T> : IComparer where T : class
        {
            private readonly IComparer<T> _comparer;

            public ComparerWrapper(IComparer<T> comparer)
            {
                _comparer = comparer;
            }

            public int Compare(object x, object y)
            {
                return _comparer.Compare(x as T, y as T);
            }
        }        
    }
}