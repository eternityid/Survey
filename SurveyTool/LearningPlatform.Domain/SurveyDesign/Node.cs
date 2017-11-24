using LearningPlatform.Domain.Common;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace LearningPlatform.Domain.SurveyDesign
{
    public abstract class Node : IPosition, IVersionable
    {
        protected Node()
        {
            ChildNodes = new List<Node>();
            ChildIds = new List<string>();
        }

        public string Id { get; set; }
        public string Alias { get; set; }
        public string ParentId { get; set; }
        public string SurveyId { get; set; }
        public string LibraryId { get; set; }

        [JsonIgnore, Obsolete]
        public int Position { get; set; }
        public bool IsFixedPosition { get; set; }
        [JsonIgnore]
        public List<string> ChildIds { get; set; }
        public List<Node> ChildNodes { get; set; }
        [JsonIgnore]
        public Node Parent { get; set; }

        public abstract IList<string> QuestionAliases { get; }
        public string NodeType { get; set; }
        public byte[] RowVersion { get; set; }

        public string Version { get; set; }
    }
}