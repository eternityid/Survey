using System.Collections.Generic;
using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyExecution;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace LearningPlatform.Domain.Tests.SurveyExecutionTests.OrderedListTests
{
    [TestClass]
    public class OrderedListWithFixedPositions_Should
    {
        [TestMethod]
        public void ReturnSameOrderWhenSeedIs2()
        {
            OrderedList<Item> list = CreateOrderedList(OrderType.Rotated, 2);

            Assert.AreEqual("a", list[0].Name);
            Assert.AreEqual("b", list[1].Name);
            Assert.AreEqual("c", list[2].Name);
            Assert.AreEqual("d", list[3].Name);
            Assert.AreEqual("e", list[4].Name);
        }

        [TestMethod]
        public void ReturnRotatedOrderWhenSeedIs3()
        {
            OrderedList<Item> list = CreateOrderedList(OrderType.Rotated, 3);

            Assert.AreEqual("a", list[0].Name);
            Assert.AreEqual("d", list[1].Name);
            Assert.AreEqual("c", list[2].Name);
            Assert.AreEqual("b", list[3].Name);
            Assert.AreEqual("e", list[4].Name);
        }


        private static OrderedList<Item> CreateOrderedList(OrderType orderType, int seed)
        {
            return new OrderedList<Item>(orderType,
                new List<Item>
                {
                    new Item {Name = "a", IsFixedPosition = true},
                    new Item {Name = "b", IsFixedPosition = false},
                    new Item {Name = "c", IsFixedPosition = true},
                    new Item {Name = "d", IsFixedPosition = false},
                    new Item {Name = "e", IsFixedPosition = true},
                }
                , seed);
        }

        private class Item : IFixedPosition
        {
            public string Name { get; set; }
            public bool IsFixedPosition { get; set; }
        }
    }
}