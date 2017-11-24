using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.RepositoryContracts;
using System.Collections.Generic;

namespace LearningPlatform.Data.Memory.Repositories
{
    public class NodeMemoryRepository: INodeRepository
    {
        public IList<Node> GetNodesBySurveyId(string surveyId)
        {
            throw new System.NotImplementedException();
        }

        public IList<Node> GetNodesBySurveyIds(IList<string> surveyIds)
        {
            throw new System.NotImplementedException();
        }

        public void Add(Node node)
        {
            throw new System.NotImplementedException();
        }

        public void AddMany(IList<Node> nodes)
        {
            throw new System.NotImplementedException();
        }

        public void Update(Node node)
        {
            //Don't need to do anything
        }

        public void Delete(Node node)
        {
            throw new System.NotImplementedException();
        }

        public void DeleteMany(IList<Node> nodes)
        {
            throw new System.NotImplementedException();
        }

        public Node GetNode(string nodeId)
        {
            throw new System.NotImplementedException();
        }
    }
}
