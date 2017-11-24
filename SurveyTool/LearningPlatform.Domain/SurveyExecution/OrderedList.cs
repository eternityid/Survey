using System;
using System.Collections;
using System.Collections.Generic;
using LearningPlatform.Domain.Common;

namespace LearningPlatform.Domain.SurveyExecution
{
    public class OrderedList<T> : IList<T>, ICollection
    {
        private readonly IList<T> _elements;
        private readonly List<int> _indexOrder;
        private readonly OrderType _orderType;
        private readonly int _seed;
        private readonly Random _random;

        public OrderedList(OrderType orderType, IList<T> elements, int seed)
        {
            _seed = seed;
            _random = new Random(seed);
            _elements = elements;
            _orderType = orderType;
            _indexOrder = new List<int>();
        }


        public void CopyTo(Array array, int index)
        {
            var elements = GetOrderedElements();
            ((ICollection) elements).CopyTo(array, index);
        }

        public void CopyTo(T[] array, int arrayIndex)
        {
            var elements = GetOrderedElements();
            elements.CopyTo(array, arrayIndex);
        }

        private List<T> GetOrderedElements()
        {
            var elements = new List<T>();
            foreach (var item in this)
            {
                elements.Add(item);
            }
            return elements;
        }

        public object SyncRoot
        {
            get { return this; }
        }

        public bool IsSynchronized
        {
            get { return false; }
        }

        public IEnumerator<T> GetEnumerator()
        {
            return new Enumerator<T>(this);
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }

        public void Add(T item)
        {
            _elements.Add(item);
        }

        public void Clear()
        {
            _elements.Clear();
        }

        public bool Contains(T item)
        {
            return _elements.Contains(item);
        }

        public bool Remove(T item)
        {
            return _elements.Remove(item);
        }

        public int Count
        {
            get { return _elements.Count; }
        }

        public bool IsReadOnly
        {
            get { return true; }
        }

        public int IndexOf(T item)
        {
            return GetOuterIndex(_elements.IndexOf(item));
        }

        public void Insert(int index, T item)
        {
            _elements.Insert(GetInnerIndex(index), item);
        }

        public void RemoveAt(int index)
        {
            _elements.RemoveAt(GetInnerIndex(index));
        }

        public T this[int index]
        {
            get { return _elements[GetInnerIndex(index)]; }
            set { _elements[GetInnerIndex(index)] = value; }
        }

        private int GetInnerIndex(int index)
        {
            if (_indexOrder.Count != _elements.Count)
            {
                GenerateIndexOrder();
            }
            return _indexOrder[index];
        }

        private void GenerateIndexOrder()
        {
            _indexOrder.Clear();
            CreateInOrderSequence();
            if (_orderType == OrderType.InOrder)
                return;
            IEnumerable<int> fixedPositions = GetFixedPositionIndexes();

            switch (_orderType)
            {
                case OrderType.Random:
                    CreateRandomSequence();
                    break;
                case OrderType.Flipped:
                    CreateFlippedSequence();
                    break;
                case OrderType.Rotated:
                    CreateRotatedSequence();
                    break;
                case OrderType.InOrder:
                case OrderType.Alphabetical:
                    //Do nothing (alphabetical order is outside the scope of this class)
                    break;
                default:
                    throw new NotSupportedException("Unknown order type "+_orderType);
            }
            ApplyFixedPositions(fixedPositions);
        }

        private void ApplyFixedPositions(IEnumerable<int> fixedPositions)
        {
            foreach (int index in fixedPositions)
            {
                _indexOrder.Insert(index, index);
            }
        }

        private IEnumerable<int> GetFixedPositionIndexes()
        {
            var fixedPositionIndexes = new List<int>();
            for (int index = 0; index < _elements.Count; index++)
            {
                T item = _elements[index];
                var position = item as IFixedPosition;
                if (position != null && position.IsFixedPosition)
                {
                    fixedPositionIndexes.Add(index);
                    _indexOrder.Remove(index);
                }
            }
            return fixedPositionIndexes;
        }

        private void CreateRotatedSequence()
        {
            int rotationPointIndex = _seed%_indexOrder.Count;
            for (int i = 0; i < rotationPointIndex; i++)
            {
                int item = _indexOrder[0];
                _indexOrder.RemoveAt(0);
                _indexOrder.Add(item);
            }
        }

        private void CreateFlippedSequence()
        {
            if (_seed%2 == 0)
            {
                return;
            }
            _indexOrder.Reverse();
        }

        private void CreateInOrderSequence()
        {
            for (int i = 0; i < _elements.Count; i++)
                _indexOrder.Add(i);
        }

        private void CreateRandomSequence()
        {
            var basket = new List<int>(_indexOrder);
            _indexOrder.Clear();
            while (basket.Count > 0)
            {
                int index = _random.Next(basket.Count);
                _indexOrder.Add(basket[index]);
                basket.RemoveAt(index);
            }
        }


        private int GetOuterIndex(int index)
        {
            if (_indexOrder.Count != _elements.Count)
            {
                GenerateIndexOrder();
            }
            return _indexOrder.IndexOf(index);
        }
    }
}