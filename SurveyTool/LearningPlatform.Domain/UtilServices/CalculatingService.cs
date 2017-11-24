using System;

namespace LearningPlatform.Domain.UtilServices
{
    public static class CalculatingService
    {
        public static double CalculatePercentage(int actual, int total)
        {
            if (total == 0 || actual == 0)
            {
                return 0;
            }

            int numberOfDigitsAfterDecimalPoint = 2;
            return Math.Round(((double)actual / total) * 100, numberOfDigitsAfterDecimalPoint);
        }

        public static string GetDecimalPlaces(double value) {
            string inputDecimalNumber = Convert.ToString(value);
            string decimalPlaces = "";

            var regex = new System.Text.RegularExpressions.Regex("(?<=[\\.])[0-9]+");
            if (regex.IsMatch(inputDecimalNumber))
            {
                decimalPlaces = regex.Match(inputDecimalNumber).Value;
            }
            return decimalPlaces;
        }
    }
}
