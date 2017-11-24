using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyExecution.Engine;
using System.Collections.Generic;

namespace LearningPlatform.Domain.Common
{
    public class NodeServiceMemoryCache : INodeServiceCache
    {
        private readonly IDictionary<Survey, INodeService> _nodeServices = new Dictionary<Survey, INodeService>();

        public INodeService Get(Survey survey)
        {
            INodeService nodeService;
            if (_nodeServices.TryGetValue(survey, out nodeService)) return nodeService;
            nodeService = new NodeService(survey);
            _nodeServices[survey] = nodeService;
            return nodeService;
        }
    }
}