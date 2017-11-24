using System.Security.Cryptography;

namespace LearningPlatform.Domain.SurveyExecution.Security
{
    public static class CredentialGenerator
    {
        private const int Length = 10;
        public static string Create()
        {
            var randBuffer = new byte[Length];
            RandomNumberGenerator.Create().GetBytes(randBuffer);
            return System.Convert.ToBase64String(randBuffer).Remove(Length);
        }
    }
}