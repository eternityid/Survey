using LearningPlatform.Domain.Common;
using System.Collections.Generic;
using System.Linq;

namespace LearningPlatform.Domain.SurveyLayout
{
    public class Layout : IVersionable
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Css { get; set; }
        public List<Template> Templates { get; set; }


        public T GetDefault<T>() where T : Template
        {
            return Templates.OfType<T>().FirstOrDefault(p => p.IsDefault);
        }

        public byte[] RowVersion { get; set; }
    }
}