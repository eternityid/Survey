using System;
using System.Globalization;

namespace LearningPlatform.ResponseDataIndexer
{
    public class Logger
    {
        public static void Log(string message)
        {
            Console.WriteLine("{0}\t" + message, DateTime.UtcNow.ToString(CultureInfo.InvariantCulture));
        }

        public static void Log(string message, object arg0)
        {
            Log(string.Format(message, arg0));
        }


        public static void Log(string message, object arg0, object arg1)
        {
            Log(string.Format(message, arg0, arg1));
        }

        internal static void Log(string message, object arg0, object arg1, object arg2)
        {
            Log(string.Format(message, arg0, arg1, arg2));
        }

    }
}