using LearningPlatform.Domain.AccessControl;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using LearningPlatform.Domain.SurveyLayout;
using LearningPlatform.Domain.SurveyThemes;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Configuration;
using LearningPlatform.Domain.Libraries;

namespace LearningPlatform.Data.MongoDb
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext()
        {
            var client = new MongoClient(ConfigurationManager.ConnectionStrings["MongoDB"].ConnectionString);

            var databaseName = ConfigurationManager.AppSettings["MongoDBDatabaseName"] ?? "surveyStore";
            _database = client.GetDatabase(databaseName);
        }

        public IMongoCollection<Survey> SurveyCollection => GetCollection<Survey>("surveys");
        public IMongoCollection<QuestionDefinition> QuestionCollection => GetCollection<QuestionDefinition>("questions");
        public IMongoCollection<Node> NodeCollection => GetCollection<Node>("nodes");
        public IMongoCollection<Layout> LayoutCollection => GetCollection<Layout>("layouts");
        public IMongoCollection<Theme> ThemeCollection => GetCollection<Theme>("themes");
        public IMongoCollection<OptionList> OptionListCollection => GetCollection<OptionList>("optionLists");
        public IMongoCollection<Library> LibraryCollection => GetCollection<Library>("libaries");
        public IMongoCollection<Company> CompanyCollection => GetCollection<Company>("companies");
        public IMongoCollection<User> UserCollection => GetCollection<User>("users");

        public IMongoCollection<T> GetCollection<T>(string name)
        {
            return _database.GetCollection<T>(name);
        }

        public void EnsureIndexes()
        {
            SurveyCollection.Indexes.CreateMany(new List<CreateIndexModel<Survey>>
            {
                new CreateIndexModel<Survey>(Builders<Survey>.IndexKeys.Ascending(p => p.UserId)),
                new CreateIndexModel<Survey>(Builders<Survey>.IndexKeys.Ascending(p => p.AccessRights.Write)),
                new CreateIndexModel<Survey>(Builders<Survey>.IndexKeys.Ascending(p => p.AccessRights.Full))
            });
            NodeCollection.Indexes.CreateOne(Builders<Node>.IndexKeys.Ascending(p => p.SurveyId));
            QuestionCollection.Indexes.CreateOne(Builders<QuestionDefinition>.IndexKeys.Ascending(p => p.SurveyId));
            OptionListCollection.Indexes.CreateOne(Builders<OptionList>.IndexKeys.Ascending(p => p.SurveyId));
            LibraryCollection.Indexes.CreateOne(Builders<Library>.IndexKeys.Ascending(p => p.UserId));
            CompanyCollection.Indexes.CreateOne(Builders<Company>.IndexKeys.Ascending(p => p.Name));
            UserCollection.Indexes.CreateMany(new List<CreateIndexModel<User>>
            {
                new CreateIndexModel<User>(Builders<User>.IndexKeys.Ascending(p => p.Email)),
                new CreateIndexModel<User>(Builders<User>.IndexKeys.Ascending(p => p.CompanyId)),
                new CreateIndexModel<User>(Builders<User>.IndexKeys.Ascending(p => p.FullName)),
                new CreateIndexModel<User>(Builders<User>.IndexKeys.Ascending(p => p.ExternalId), new CreateIndexOptions {Unique = true})
            });
        }
    }
}
