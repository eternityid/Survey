using System;
using System.Collections;
using System.Collections.Generic;
using System.Reflection;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Questions;

namespace LearningPlatform.Data.Memory.Repositories
{
    public class SurveyMemoryContext
    {
        private readonly List<object> _objects = new List<object>();

        public void Clear()
        {
            _objects.Clear();
        }

        public void Add(object obj)
        {
            var allObjects = new List<object>();
            GetAllObjects(obj, new HashSet<object>(), allObjects);
            foreach (var o in allObjects)
            {
                if (!_objects.Contains(o))
                {
                    _objects.Add(o);
                }
            }
        }

        private void GetAllObjects(object obj, HashSet<object> objectsSeen, List<object> found)
        {
            if (obj == null || objectsSeen.Contains(obj)) return;
            if (IsSimpleType(obj)) return;


            objectsSeen.Add(obj);
            IEnumerable enumerable = obj as IEnumerable;
            if (enumerable != null)
            {
                foreach (object o in enumerable)
                {
                    GetAllObjects(o, objectsSeen, found);
                }
                return;
            }

            found.Add(obj);
            var properties = obj.GetType().GetProperties(BindingFlags.Instance | BindingFlags.Public);
            foreach (PropertyInfo property in properties)
            {
                var newValue = property.GetValue(obj, null);
                GetAllObjects(newValue, objectsSeen, found);
            }
        }

        private static bool IsSimpleType(object obj)
        {
            return Convert.GetTypeCode(obj) != TypeCode.Object || obj is Guid;
        }

        public void AssignIds()
        {
            Dictionary<Type, long> maxIdDictionary = GetMaxIdDictionary();

            foreach (var obj in _objects)
            {
                var id = GetIdValue(obj);
                if(id==NoIdObject) continue;

                var type = GetTypeUsedForMaxId(obj);
                var currentMax = maxIdDictionary[type];
                var idLong = id as long?;
                if (idLong.HasValue && idLong.Value==0)
                {
                    var newMax = currentMax + 1;
                    maxIdDictionary[type] = newMax;
                    SetIdValue(obj, newMax);
                }
                else if (id==null)
                {
                    var newMax = currentMax + 1;
                    maxIdDictionary[type] = newMax;
                    SetIdValue(obj, newMax.ToString());
                }
            }
        }

        private Dictionary<Type, long> GetMaxIdDictionary()
        {
            var maxIds = new Dictionary<Type, long>();
            foreach (var obj in _objects)
            {
                long maxIdForType;
                var type = GetTypeUsedForMaxId(obj);
                maxIds.TryGetValue(type, out maxIdForType);
                object idObject = GetIdValue(obj);
                if (idObject is long)
                {
                    maxIds[type] = Math.Max(maxIdForType, (long)idObject);
                }
                else if (idObject is string)
                {
                    maxIds[type] = Math.Max(maxIdForType, long.Parse((string)idObject));
                }
            }
            return maxIds;
        }

        private static object NoIdObject = new Object();

        private object GetIdValue(object obj)
        {
            var idPropertyInfo = GetIdPropertyInfo(obj);
            if (idPropertyInfo != null && idPropertyInfo.CanRead)
            {
                return idPropertyInfo.GetValue(obj, null);
            }
            return NoIdObject;
        }

        private static Type GetTypeUsedForMaxId(object obj)
        {
            if (obj is QuestionDefinition)
            {
                return typeof (QuestionDefinition);
            }
            if (obj is Node)
            {
                return typeof (Node);
            }

            return obj.GetType();
        }

        private void SetIdValue(object obj, object id)
        {
            var idPropertyInfo = GetIdPropertyInfo(obj);
            if (idPropertyInfo!=null && idPropertyInfo.CanWrite)
            {
                idPropertyInfo.SetValue(obj, id, null);
            }
        }

        private static PropertyInfo GetIdPropertyInfo(object obj)
        {
            return obj.GetType().GetProperty("Id", BindingFlags.Public | BindingFlags.Instance);
        }
    }
}