using System;
using Analyze.Application;
using Analyze.Domain;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Analyze.Persistence;
using Analyze.Infrastructure;
using Analyze.Service.Filters;
using Microsoft.Extensions.Logging;
using Swashbuckle.AspNetCore.Swagger;

namespace Analyze.Service
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IContainer ApplicationContainer { get; private set; }
		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		// ConfigureServices is where you register dependencies. This gets
		// called by the runtime before the Configure method, below.
		public IServiceProvider ConfigureServices(IServiceCollection services)
		{
			// Add services to the collection.
			services
				.AddMvc(options =>
				{
					options.Filters.Add(typeof(HttpGlobalExceptionFilter));
				})
				.AddJsonOptions(options =>
				{
					options.SerializerSettings.Converters.Add(new Newtonsoft.Json.Converters.StringEnumConverter());
					options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
				});

			services.AddSwaggerGen(options =>
			{
				options.DescribeAllEnumsAsStrings();
				options.SwaggerDoc("v1", new Info
				{
					Title = "Analytics - Analyze HTTP API",
					Version = "v1"
				});
			});

			services.AddCors(options =>
			{
				options.AddPolicy("CorsPolicy",
					pb => pb.AllowAnyOrigin()
						.AllowAnyMethod()
						.AllowAnyHeader()
						.AllowCredentials());
			});

			// Create the container builder.
			var builder = new ContainerBuilder();

			// Register dependencies, populate the services from
			// the collection, and build the container. If you want
			// to dispose of the container at the end of the app,
			// be sure to keep a reference to it as a property or field.
			//
			// Note that Populate is basically a foreach to add things
			// into Autofac that are in the collection. If you register
			// things in Autofac BEFORE Populate then the stuff in the
			// ServiceCollection can override those things; if you register
			// AFTER Populate those registrations can override things
			// in the ServiceCollection. Mix and match as needed.
			builder.Populate(services);

			builder.RegisterModule(new AnalyzeDomainModule());
			builder.RegisterModule(new AnalyzeInfrastructureModule { Configuration = Configuration });
			builder.RegisterModule<AnalyzePersistenceModule>();
			builder.RegisterModule<AnalyzeApplicationModule>();

			ApplicationContainer = builder.Build();

			// Create the IServiceProvider based on the container.
			return new AutofacServiceProvider(ApplicationContainer);
		}


		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}

			//Configure logs
			loggerFactory.AddConsole(Configuration.GetSection("Logging"));
			loggerFactory.AddDebug();

			app.UseCors("CorsPolicy");

			app.UseMvc();

			app.UseSwagger()
				.UseSwaggerUI(c =>
				{
					c.SwaggerEndpoint("/swagger/v1/swagger.json", "Analyze HTTP API V1");
				});

			AnalyzeDbContextSeeder.SeedAsync(Configuration).Wait();
		}
	}
}
