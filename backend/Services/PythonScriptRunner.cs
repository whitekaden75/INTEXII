using System;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace YourProject.Services
{
    public class PythonScriptService
    {
        private readonly ILogger<PythonScriptService> _logger;
        private readonly string _pythonPath;
        private readonly string _scriptDirectory;
        private readonly string _databaseDirectory;

        public PythonScriptService(ILogger<PythonScriptService> logger)
        {
            _logger = logger;
            
            // For Azure App Service, Python is typically installed here
            _pythonPath = Path.Combine(Environment.GetEnvironmentVariable("HOME") ?? "", "site", "wwwroot", "python_env", "bin", "python");
            if (!File.Exists(_pythonPath))
            {
                // Fallback to system Python
                _pythonPath = "python";
            }
            
            // Get paths
            string basePath = Path.Combine(Directory.GetCurrentDirectory());
            _scriptDirectory = Path.Combine(basePath, "python-scripts");
            _databaseDirectory = Path.Combine(basePath, "App_Data", "databases");
            
            // Ensure database directory exists
            Directory.CreateDirectory(_databaseDirectory);
        }

        public async Task<bool> RunScriptAsync(string scriptName)
        {
            try
            {
                string scriptPath = Path.Combine(_scriptDirectory, scriptName);
                _logger.LogInformation($"Running Python script: {scriptPath}");

                // Make sure script exists
                if (!File.Exists(scriptPath))
                {
                    _logger.LogError($"Script does not exist: {scriptPath}");
                    return false;
                }

                // Setup environment variables for the process
                var envVars = new System.Collections.Generic.Dictionary<string, string>
                {
                    { "DB_DIRECTORY", _databaseDirectory }
                };

                var processStartInfo = new ProcessStartInfo
                {
                    FileName = _pythonPath,
                    Arguments = scriptPath,
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true,
                    WorkingDirectory = _scriptDirectory
                };

                // Add environment variables
                foreach (var envVar in envVars)
                {
                    processStartInfo.Environment[envVar.Key] = envVar.Value;
                }

                var process = new Process { StartInfo = processStartInfo };
                process.Start();
                
                string output = await process.StandardOutput.ReadToEndAsync();
                string error = await process.StandardError.ReadToEndAsync();
                await process.WaitForExitAsync();

                if (!string.IsNullOrEmpty(output))
                    _logger.LogInformation($"Script output: {output}");
                
                if (!string.IsNullOrEmpty(error))
                    _logger.LogError($"Script error: {error}");

                return process.ExitCode == 0;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error running script {scriptName}");
                return false;
            }
        }
    }
}