using System;
using System.Threading;
using LearningPlatform.Domain.Common;

namespace LearningPlatform.TestFramework
{
    public class ControlledRandomForTests : IThreadSafeRandom
    {
        private static readonly ThreadLocal<Random> Random = new ThreadLocal<Random>(() => new Random(1)); // Use seed 1 to get predictable results

        private static DateTime _startDate = new DateTime(1995, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        public void Reset(int seed)
        {
            Random.Value = new Random(seed);
        }

        public int Next()
        {
            return Random.Value.Next();
        }

        public int Next(int maxValue)
        {
            return Random.Value.Next(maxValue);
        }

        public int Next(int minValue, int maxValue)
        {
            return Random.Value.Next(minValue, maxValue);
        }

        public double NextDouble()
        {
            return Random.Value.NextDouble();
        }

        public void NextBytes(byte[] buffer)
        {
            Random.Value.NextBytes(buffer);
        }

        public DateTime NextRandomDateTime()
        {
            return NextRandomDateTime(_startDate, new DateTime(2015, 11, 19));
        }

        public DateTime NextRandomDateTime(DateTime start, DateTime end)
        {
            int rangeInDays = (end - start).Days;

            return
                _startDate.AddDays(Random.Value.Next(rangeInDays))
                    .AddHours(Random.Value.Next(0, 24))
                    .AddMinutes(Random.Value.Next(0, 60))
                    .AddSeconds(Random.Value.Next(0, 60));
        }
    }
}