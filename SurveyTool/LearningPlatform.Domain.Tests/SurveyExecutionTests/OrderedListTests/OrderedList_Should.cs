using System.Collections.Generic;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyExecution;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace LearningPlatform.Domain.Tests.SurveyExecutionTests.OrderedListTests
{
    [TestClass]
    public class OrderedList_Should
    {
        [TestMethod]
        public void ReturnInOrder()
        {
            var list = new OrderedList<string>(OrderType.InOrder, new List<string> {"a", "b", "c"}, 2);
            CollectionAssert.AreEqual(new List<string> {"a", "b", "c"}, list);
        }

        [TestMethod]
        public void ReturnRandomWhenSeedIs2()
        {
            var list = new OrderedList<string>(OrderType.Random, new List<string> {"a", "b", "c"}, 2);

            CollectionAssert.AreEqual(new List<string> {"c", "a", "b"}, list);
        }

        [TestMethod]
        public void ReturnRandomWhenSeedIs3()
        {
            var list = new OrderedList<string>(OrderType.Random, new List<string> {"a", "b", "c"}, 3);

            CollectionAssert.AreEqual(new List<string> {"a", "c", "b"}, list);
        }


        [TestMethod]
        public void ReturnInOrderWhenFlippedAndSeedIs2()
        {
            var list = new OrderedList<string>(OrderType.Flipped, new List<string> {"a", "b", "c"}, 2);

            CollectionAssert.AreEqual(new List<string> {"a", "b", "c"}, list);
        }

        [TestMethod]
        public void ReturnFlippedWhenSeedIs3()
        {
            var list = new OrderedList<string>(OrderType.Flipped, new List<string> {"a", "b", "c"}, 3);

            CollectionAssert.AreEqual(new List<string> {"c", "b", "a"}, list);
        }

        [TestMethod]
        public void ReturnRotatedWhenSeedIs1()
        {
            var list = new OrderedList<string>(OrderType.Rotated, new List<string> {"a", "b", "c"}, 1);

            CollectionAssert.AreEqual(new List<string> {"b", "c", "a"}, list);
        }

        [TestMethod]
        public void ReturnRotatedWhenSeedIs2()
        {
            var list = new OrderedList<string>(OrderType.Rotated, new List<string> {"a", "b", "c"}, 2);

            CollectionAssert.AreEqual(new List<string> {"c", "a", "b"}, list);
        }

        [TestMethod]
        public void ReturnInOrderWhenRotatedAndSeedIs56()
        {
            var list = new OrderedList<string>(OrderType.Rotated, new List<string> {"a", "b", "c"}, 57);

            CollectionAssert.AreEqual(new List<string> {"a", "b", "c"}, list);
        }
    }
}