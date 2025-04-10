using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace YourProject.Services
{
    public class PythonScriptHostedService : BackgroundService
    {
        private readonly PythonScriptService _pythonService;
        private readonly ILogger<PythonScriptHostedService> _logger;

        public PythonScriptHostedService(PythonScriptService pythonService, ILogger<PythonScriptHostedService> logger)
        {
            _pythonService = pythonService;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Python Script Hosted Service running.");

            // Run immediately on startup (optional)
            await RunScripts();

            // Set up timer for daily execution
            using var timer = new PeriodicTimer(TimeSpan.FromDays(1));
            
            while (await timer.WaitForNextTickAsync(stoppingToken) && !stoppingToken.IsCancellationRequested)
            {
                await RunScripts();
            }
        }

        private async Task RunScripts()
        {
            try
            {
                _logger.LogInformation($"Running Python scripts at: {DateTime.Now}");
                
                // Run your scripts
                await _pythonService.RunScriptAsync("moviefilter.py");
                // Add other scripts as needed
                
                _logger.LogInformation($"Python scripts completed at: {DateTime.Now}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while running Python scripts.");
            }
        }
    }
}