using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System.Configuration;

namespace LearningPlatform.Domain.Common
{
    public static class AzureStorageBlobContainerFactory
    {
        private static readonly string ConnectionString = ConfigurationManager.AppSettings["StorageConnectionString"];
        private static readonly string DefaultContainerName = ConfigurationManager.AppSettings["ContainerAzureStorage"];
        public static CloudBlobContainer BlobContainer(string containerName = null)
        {
            if (string.IsNullOrWhiteSpace(containerName)) containerName = DefaultContainerName;

            var storageAccount = CloudStorageAccount.Parse(ConnectionString);
            var blobClient = storageAccount.CreateCloudBlobClient();
            var container = blobClient.GetContainerReference(containerName);
            container.CreateIfNotExists();
            container.SetPermissions(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });
            return container;
        }
    }
}
