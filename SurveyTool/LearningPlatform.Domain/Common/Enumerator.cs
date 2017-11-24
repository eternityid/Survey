using System;
using System.Collections;
using System.Collections.Generic;

namespace LearningPlatform.Domain.Common
{
    public class Enumerator<T> : IEnumerator<T>, IEnumerable
    {
        private readonly IList<T> _innerList;

        private int _index = -1;

        public Enumerator(IList<T> innerList)
        {
            _innerList = innerList;
        }

        public IEnumerator GetEnumerator()
        {
            throw new NotImplementedException();
        }

        public void Dispose()
        {
            // No resources to dispose
        }

        public bool MoveNext()
        {
            _index++;
            return _index < _innerList.Count;
        }

        public void Reset()
        {
            _index = 0;
        }

        public T Current
        {
            get { return _innerList[_index]; }
            set { _innerList[_index] = value; }
        }

        object IEnumerator.Current
        {
            get { return Current; }
        }
    }
}