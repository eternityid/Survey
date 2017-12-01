using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace Analyze.Service
{
    public class Program
    {
        public static void Main(string[] args)
        {
            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
				.UseKestrel()
				.UseUrls("http://*:3000")
                .UseStartup<Startup>()
                .Build();
    }
}
