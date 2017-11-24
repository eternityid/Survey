using System;

namespace LearningPlatform.Domain.AccessControl
{
    public class User
    {
        public string Id { get; set; }
        public string ExternalId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string CompanyId { get; set; }
        public DateTime? RegisteredDateTime { get; set; }
        public DateTime? LastLoginDateTime { get; set; }
        public int LoginCount { get; set; }
    }
}
