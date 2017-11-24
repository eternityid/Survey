using System;

namespace LearningPlatform.Domain.Common
{
    public interface IThreadSafeRandom
    {
        int Next();
        int Next(int rangeInDays);
        int Next(int minValue, int maxValue);
        double NextDouble();
        void NextBytes(byte[] buffer);
        DateTime NextRandomDateTime();
        DateTime NextRandomDateTime(DateTime subtract, DateTime today);
    }
}