using System;

namespace LearningPlatform.Domain.SurveyExecution.Engine.RandomDataGenerator
{
    public class RandomDataGeneratorSettings
    {
        public bool RandomizeDateTimes { get; set; }

        public DateTime FromDateTime { get; set; }
        public DateTime ToDateTime { get; set; }


        public int Iterations { get; set; }
        public int MinDuration { get; set; }
        public int MaxDuration { get; set; }
    }
}