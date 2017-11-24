using System;
using System.Text.RegularExpressions;
using MongoDB.Bson;

namespace LearningPlatform.Domain.Helpers
{
    public static class ObjectIdHelper
    {
        public static string GetObjectIdFromLongString(string idString)
        {
            if(string.IsNullOrWhiteSpace(idString) || Validate(idString))
            {
                return idString;
            }
            var id = long.Parse(idString);
            var valueBytes = BitConverter.GetBytes(id);
            var valueHigh = BitConverter.ToInt32(valueBytes, BitConverter.IsLittleEndian ? 4 : 0);
            var valueLow = BitConverter.ToInt32(valueBytes, BitConverter.IsLittleEndian ? 0 : 4);
            return new ObjectId(valueHigh, 0, 0, valueLow).ToString();
        }

        public static bool Validate(string idString)
        {
            var objectIdRegex = new Regex(@"^[0-9a-fA-F]{24}$");
            return objectIdRegex.IsMatch(idString);
        }
    }
}