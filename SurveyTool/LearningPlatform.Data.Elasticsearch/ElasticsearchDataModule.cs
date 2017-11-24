using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Autofac;
using LearningPlatform.Domain.Reporting;

namespace LearningPlatform.Data.Elasticsearch
{
    public class ElasticsearchDataModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<ElasticsearchReportingClient>()
                .As<IElasticsearchReportingClient>()
                .InstancePerLifetimeScope();
        }
    }
}
