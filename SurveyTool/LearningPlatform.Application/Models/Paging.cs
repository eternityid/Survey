using System;

namespace LearningPlatform.Application.Models
{
    public class Paging
    {
        public string start { get; set; }
        public string limit { get; set; }

        public int startInt
        {
            get
            {
                try
                {
                    return int.Parse(start);
                }
                catch (Exception)
                {
                    return 0;
                }
            }
        }

        public int limitInt
        {
            get
            {
                try
                {
                    return int.Parse(limit);
                }
                catch (Exception)
                {
                    return 10;
                }
            }
        }
    }
}