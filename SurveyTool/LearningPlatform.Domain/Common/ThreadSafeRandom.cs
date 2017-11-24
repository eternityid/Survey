using System;
using System.Threading;

namespace LearningPlatform.Domain.Common
{
    public class ThreadSafeRandom : IThreadSafeRandom
    {
        private static readonly ThreadLocal<Random> Random =
                            new ThreadLocal<Random>(() => new Random());

        private static readonly DateTime StartDate = new DateTime(1995, 1, 1, 0, 0, 0, DateTimeKind.Utc);


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
            return NextRandomDateTime(StartDate, DateTime.Today);
        }

        public DateTime NextRandomDateTime(DateTime start, DateTime end)
        {
            int rangeInDays = (end - start).Days;

            return
                start.AddDays(Random.Value.Next(rangeInDays))
                    .AddHours(Random.Value.Next(0, 24))
                    .AddMinutes(Random.Value.Next(0, 60))
                    .AddSeconds(Random.Value.Next(0, 60));
        }


    }


}