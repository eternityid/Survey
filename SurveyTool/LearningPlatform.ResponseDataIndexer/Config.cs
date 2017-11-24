using System.Configuration;

namespace LearningPlatform.ResponseDataIndexer
{
    public class Config
    {
        public static string SqlConnectionString => ConfigurationManager.ConnectionStrings["ResponseConnectionString"].ConnectionString;

        public static string ElasticsearchConnectionString => ConfigurationManager.ConnectionStrings["ESConnectionString"].ConnectionString;

        public static string SurveyDefaultIndexName => ConfigurationManager.AppSettings["ESSurveyDefaultIndexName"]??"survey";


        public static int GetSleepTime()
        {
            try
            {
                return int.Parse(ConfigurationManager.AppSettings["sleepTime"]);
            }
            catch
            {
                return 5000;
            }
        }
    }
}
