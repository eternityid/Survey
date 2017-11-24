using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace LearningPlatform.TestFramework
{
    public static class CollectionAssertGeneric<T> where T : class
    {
        public static void AreEqual(IEnumerable<T> expected, IEnumerable<T> actual, IComparer<T> comparer) 
        {
            CollectionAssert.AreEqual(expected.ToArray(), actual.ToArray(), comparer.ToComparer());
        }
        
    }
}