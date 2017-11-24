using System.Web;
using LearningPlatform.Domain.SurveyDesign;

namespace LearningPlatform.Domain.SurveyExecution.Engine
{
    public class NodeServiceCache : INodeServiceCache
    {
        public INodeService Get(Survey survey)
        {
            string key = GetKey(survey);
            var cache = HttpContext.Current.Items;
            var nodeService = cache[key] as INodeService;
            if (nodeService!=null) return nodeService;
            nodeService = new NodeService(survey);
            cache[key] = nodeService;
            return nodeService;
        }

        private string GetKey(Survey survey)
        {
            return string.Format("nodeServiceCache_{0}", survey.Id);
        }
    }
}