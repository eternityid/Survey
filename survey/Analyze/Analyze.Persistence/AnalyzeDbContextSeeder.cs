using System.Collections.Generic;
using System.Threading.Tasks;
using Analyze.Domain.DataSources;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;

namespace Analyze.Persistence
{
    public class AnalyzeDbContextSeeder
    {
		private static AnalyzeDbContext _dbContext;

		public static async Task SeedAsync(IConfiguration configuration)
		{
			_dbContext = new AnalyzeDbContext(configuration);
			if (!_dbContext.DataSourceCollection.AsQueryable().Any())
			{
				await SetIndexes();
				await SeedDataSources();
			}
		}

		private static async Task SetIndexes()
		{
			await _dbContext.DataSourceCollection.Indexes.CreateManyAsync(new List<CreateIndexModel<DataSource>>
			{
				new CreateIndexModel<DataSource>(Builders<DataSource>.IndexKeys.Ascending(p => p.ExternalId)),
				new CreateIndexModel<DataSource>(Builders<DataSource>.IndexKeys.Ascending(p => p.Title))
			});
		}

		private static async Task SeedDataSources()
		{
			var dataSource = new DataSource
			{
				Id = "59ddd5ceb7990c1a0cb4201e",
				ExternalId = "59ddd5ceb7990c1a0cb4201e",
				Title = "Analytics Survey (Don't Access Me)",
				Fields = new List<Field>()
			};
			dataSource.Fields.Add(new Field
			{
				ElasticColumnName = "havephone:multi",
				ExternalId = "59ddd648b7990c1a0cb42023",
				Type = FieldType.StringArray,
				Name = "havephone",
				Title = CreateDataSourceFieldTitle("Phone you have"),
				LegalValues = new List<FieldLegalValue>()
				{
					CreateFieldLegalValue("IPhone", "iphone"),
					CreateFieldLegalValue("Sam Sung", "samsung"),
					CreateFieldLegalValue("Nokia", "nokia"),
					CreateFieldLegalValue("Sony", "sony")
				}
			});
			dataSource.Fields.Add(new Field
			{
				ElasticColumnName = "likephone",
				ExternalId = "59ddd68bb7990c1a0cb42029",
				Type = FieldType.String,
				Name = "likephone",
				Title = CreateDataSourceFieldTitle("Phone you like best"),
				LegalValues = new List<FieldLegalValue>()
				{
					CreateFieldLegalValue("IPhone", "iphone"),
					CreateFieldLegalValue("Sam Sung", "samsung"),
					CreateFieldLegalValue("Nokia", "nokia"),
					CreateFieldLegalValue("Sony", "sony")
				}
			});
			dataSource.Fields.Add(new Field
			{
				ElasticColumnName = "nps",
				ExternalId = "59ddd6b0b7990c1a0cb4202f",
				Type = FieldType.String,
				Name = "nps",
				Title = CreateDataSourceFieldTitle("On a scale from 0-10, how likely are you to recommend Orient to a friend or colleague?"),
				LegalValues = new List<FieldLegalValue>()
				{
					CreateFieldLegalValue("0", "0"),
					CreateFieldLegalValue("1", "1"),
					CreateFieldLegalValue("2", "2"),
					CreateFieldLegalValue("3", "3"),
					CreateFieldLegalValue("4", "4"),
					CreateFieldLegalValue("5", "5"),
					CreateFieldLegalValue("6", "6"),
					CreateFieldLegalValue("7", "7"),
					CreateFieldLegalValue("8", "8"),
					CreateFieldLegalValue("9", "9"),
					CreateFieldLegalValue("10", "10")
				}
			});
			dataSource.Fields.Add(new Field
			{
				ElasticColumnName = "rating",
				ExternalId = "59ddd70fb7990c1a0cb4203c",
				Type = FieldType.String,
				Name = "rating",
				Title = CreateDataSourceFieldTitle("Please rate about company policy"),
				LegalValues = new List<FieldLegalValue>()
				{
					CreateFieldLegalValue("1", "1"),
					CreateFieldLegalValue("2", "2"),
					CreateFieldLegalValue("3", "3"),
					CreateFieldLegalValue("4", "4"),
					CreateFieldLegalValue("5", "5"),
					CreateFieldLegalValue("6", "6"),
					CreateFieldLegalValue("7", "7"),
					CreateFieldLegalValue("8", "8"),
					CreateFieldLegalValue("9", "9"),
					CreateFieldLegalValue("10", "10")
				}
			});
			dataSource.Fields.Add(new Field
			{
				ElasticColumnName = "scale",
				ExternalId = "59ddd7f6b7990c1f0c049a61",
				Type = FieldType.String,
				Name = "scale",
				Title = CreateDataSourceFieldTitle("How do you like your current work?"),
				LegalValues = new List<FieldLegalValue>()
				{
					CreateFieldLegalValue("1", "1"),
					CreateFieldLegalValue("2", "2"),
					CreateFieldLegalValue("3", "3"),
					CreateFieldLegalValue("4", "4"),
					CreateFieldLegalValue("5", "5"),
					CreateFieldLegalValue("6", "6"),
					CreateFieldLegalValue("7", "7"),
					CreateFieldLegalValue("8", "8"),
					CreateFieldLegalValue("9", "9"),
					CreateFieldLegalValue("10", "10")
				}
			});
			dataSource.Fields.Add(new Field
			{
				ElasticColumnName = "gender",
				ExternalId = "59ddd901b7990c1f0c049a6e",
				Type = FieldType.String,
				Name = "gender",
				Title = CreateDataSourceFieldTitle("Your gender"),
				LegalValues = new List<FieldLegalValue>()
				{
					CreateFieldLegalValue("Male", "male"),
					CreateFieldLegalValue("Female", "female")
				}
			});
			dataSource.Fields.Add(new Field
			{
				ElasticColumnName = "team",
				ExternalId = "59decf65b7990c1848635839",
				Type = FieldType.String,
				Name = "team",
				Title = CreateDataSourceFieldTitle("What is your team?"),
				LegalValues = new List<FieldLegalValue>()
				{
					CreateFieldLegalValue("Survey", "survey"),
					CreateFieldLegalValue("HRTool", "hr"),
					CreateFieldLegalValue("Conexus", "conexus"),
					CreateFieldLegalValue("Aspit", "aspit"),
					CreateFieldLegalValue("Back Office", "bod"),
					CreateFieldLegalValue("Geta", "geta"),
					CreateFieldLegalValue("R&D", "randd")
				}
			});
			dataSource.Fields.Add(new Field
			{
				ElasticColumnName = "agerange",
				ExternalId = "59ded01db7990c1848635842",
				Type = FieldType.String,
				Name = "agerange",
				Title = CreateDataSourceFieldTitle("What is your age range?"),
				LegalValues = new List<FieldLegalValue>()
				{
					CreateFieldLegalValue("Below 25", "1"),
					CreateFieldLegalValue("From 25 to 30", "2"),
					CreateFieldLegalValue("From 31 to 40", "3"),
					CreateFieldLegalValue("Over 40", "4")
				}
			});
			dataSource.Fields.Add(new Field
			{
				ElasticColumnName = "experience:number",
				ExternalId = "59ded066b7990c1848635848",
				Type = FieldType.Numeric,
				Name = "experience",
				Title = CreateDataSourceFieldTitle("How many year of experience?")
			});
			dataSource.Fields.Add(new Field
			{
				ElasticColumnName = "startdate:date",
				ExternalId = "59ded12ab7990c1848635849",
				Type = FieldType.Date,
				Name = "startdate",
				Title = CreateDataSourceFieldTitle("What is the started date at our company?")
			});
			dataSource.Fields.Add(new Field
			{
				ElasticColumnName = "salary:number",
				ExternalId = "59ded177b7990c184863584a",
				Type = FieldType.Numeric,
				Name = "salary",
				Title = CreateDataSourceFieldTitle("What is your (expectation) salary per month?")
			});
			dataSource.Fields.Add(new Field
			{
				ElasticColumnName = "satisfaction",
				ExternalId = "59ded20fb7990c184863584b",
				Type = FieldType.String,
				Name = "satisfaction",
				Title = CreateDataSourceFieldTitle("How about the satisfation for your current project?"),
				LegalValues = new List<FieldLegalValue>()
				{
					CreateFieldLegalValue("1", "1"),
					CreateFieldLegalValue("2", "2"),
					CreateFieldLegalValue("3", "3"),
					CreateFieldLegalValue("4", "4"),
					CreateFieldLegalValue("5", "5"),
					CreateFieldLegalValue("6", "6"),
					CreateFieldLegalValue("7", "7"),
					CreateFieldLegalValue("8", "8"),
					CreateFieldLegalValue("9", "9"),
					CreateFieldLegalValue("10", "10")
				}
			});
			dataSource.Fields.Add(new Field
			{
				ElasticColumnName = "_Started",
				Type = FieldType.Date,
				Name = ReservedFieldNames.ResponseStartedDate,
				Title = CreateDataSourceFieldTitle("Started date")
			});
			dataSource.Fields.Add(new Field
			{
				ElasticColumnName = "_LastModified",
				Type = FieldType.Date,
				Name = ReservedFieldNames.ResponseLastModifiedDate,
				Title = CreateDataSourceFieldTitle("Last modified date")
			});
			dataSource.Fields.Add(new Field
			{
				ElasticColumnName = "_Completed",
				Type = FieldType.Date,
				Name = ReservedFieldNames.ResponseCompletedDate,
				Title = CreateDataSourceFieldTitle("Completed date")
			});
			dataSource.Fields.Add(new Field
			{
				ElasticColumnName = "_uid",
				Type = FieldType.Numeric,
				Name = ReservedFieldNames.ResponseId,
				Title = CreateDataSourceFieldTitle("ResponseIds")
			});

			var dataSource2 = new DataSource
			{
				Id = "59f1ad61ee247319cc2b5971",
				ExternalId = "59f1ad61ee247319cc2b5971",
				Title = "Analytics Survey 2 (Don't Access Me)",
				Fields = new List<Field>()
			};
			dataSource2.Fields.Add(new Field
			{
				ElasticColumnName = "name",
				ExternalId = "59f1ada3ee247319cc2b5976",
				Type = FieldType.String,
				Name = "name",
				Title = CreateDataSourceFieldTitle("What's your name?")
			});
			dataSource2.Fields.Add(new Field
			{
				ElasticColumnName = "age:number",
				ExternalId = "59f1adbaee247319cc2b5977",
				Type = FieldType.Numeric,
				Name = "age",
				Title = CreateDataSourceFieldTitle("How old are you?")
			});
			dataSource2.Fields.Add(new Field
			{
				ElasticColumnName = "likeSoftwareDeveloper",
				ExternalId = "59f1ae61ee247319cc2b5978",
				Type = FieldType.String,
				Name = "likeSoftwareDeveloper",
				Title = CreateDataSourceFieldTitle("Do you like software developer?"),
				LegalValues = new List<FieldLegalValue>()
				{
					CreateFieldLegalValue("Yes", "yes"),
					CreateFieldLegalValue("No", "no"),
					CreateFieldLegalValue("Other", "other")
				}
			});
			dataSource2.Fields.Add(new Field
			{
				ElasticColumnName = "_Started",
				Type = FieldType.Date,
				Name = ReservedFieldNames.ResponseStartedDate,
				Title = CreateDataSourceFieldTitle("Started date")
			});
			dataSource2.Fields.Add(new Field
			{
				ElasticColumnName = "_LastModified",
				Type = FieldType.Date,
				Name = ReservedFieldNames.ResponseLastModifiedDate,
				Title = CreateDataSourceFieldTitle("Last modified date")
			});
			dataSource2.Fields.Add(new Field
			{
				ElasticColumnName = "_Completed",
				Type = FieldType.Date,
				Name = ReservedFieldNames.ResponseCompletedDate,
				Title = CreateDataSourceFieldTitle("Completed date")
			});
			dataSource2.Fields.Add(new Field
			{
				ElasticColumnName = "_uid",
				Type = FieldType.Numeric,
				Name = ReservedFieldNames.ResponseId,
				Title = CreateDataSourceFieldTitle("ResponseIds")
			});

			var dataSourcesList = new List<DataSource>{dataSource, dataSource2};
			await _dbContext.DataSourceCollection.InsertManyAsync(dataSourcesList);
		}

		private static FieldLegalValue CreateFieldLegalValue(string text, string value)
		{
			return new FieldLegalValue
			{
				Title = CreateDataSourceFieldTitle(text),
				Value = value
			};
		}

		private static LanguageString CreateDataSourceFieldTitle(string text)
		{
			var title = new LanguageString();
			title.UpsertDefaultLanguageStringItem(text);
			return title;
		}
	}
}
