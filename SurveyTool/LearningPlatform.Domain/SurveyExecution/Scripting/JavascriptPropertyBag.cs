using System;
using System.Collections;
using System.Collections.Generic;
using Microsoft.ClearScript;

namespace LearningPlatform.Domain.SurveyExecution.Scripting
{
    public class JavascriptPropertyBag : IPropertyBag
    {
        private readonly Func<string, object> _func;

        public JavascriptPropertyBag(Func<string, object> func)
        {
            _func = func;
        }

        public bool TryGetValue(string key, out object value)
        {
            value = ((IDictionary<string, object>)this)[key];
            return true;
        }

        object IDictionary<string, object>.this[string key]
        {
            get { return _func(key); }
            set { throw new NotImplementedException(); }
        }

        public bool Contains(KeyValuePair<string, object> item)
        {
            return true;
        }


        public bool ContainsKey(string key)
        {
            throw new NotImplementedException();
        }

        public void Add(string key, object value)
        {
            throw new NotImplementedException();
        }

        public bool Remove(string key)
        {
            throw new NotImplementedException();
        }

        public ICollection<string> Keys { get; private set; }
        public ICollection<object> Values { get; private set; }

        public IEnumerator<KeyValuePair<string, object>> GetEnumerator()
        {
            throw new NotImplementedException();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }

        public void Add(KeyValuePair<string, object> item)
        {
            throw new NotImplementedException();
        }

        public void Clear()
        {
            throw new NotImplementedException();
        }

        public void CopyTo(KeyValuePair<string, object>[] array, int arrayIndex)
        {
            throw new NotImplementedException();
        }

        public bool Remove(KeyValuePair<string, object> item)
        {
            throw new NotImplementedException();
        }

        public int Count { get; private set; }
        public bool IsReadOnly { get; private set; }
    }
}