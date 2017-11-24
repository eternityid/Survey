using System;
using System.Threading;

namespace LearningPlatform.ResponseDataIndexer
{
    public class Program
    {
        public static void Main(string[] args)
        {
            try
            {
                var sleepTime = Config.GetSleepTime();
                Logger.Log("Response Data Indexer Started");
                ElasticsearchService.EnsureTemplateExists();
                while (true)
                {
                    Indexer.Index(isTesting: false);
                    Indexer.Index(isTesting: true);
                    Thread.Sleep(sleepTime);
                }
            }
            catch (Exception exception)
            {
                Logger.Log(exception.ToString());
            }
        }
    }
}