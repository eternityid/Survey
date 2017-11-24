using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyDesign.RepositoryContracts
{
    public interface INodeRepository
    {
        void Add(Node node);
        void AddMany(IList<Node> nodes);
        void Update(Node node);
        void Delete(Node node);
        void DeleteMany(IList<Node> nodes);
        Node GetNode(string nodeId);
        IList<Node> GetNodesBySurveyId(string surveyId);
        IList<Node> GetNodesBySurveyIds(IList<string> surveyIds);
    }
}