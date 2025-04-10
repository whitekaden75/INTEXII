@echo off
echo Starting custom deployment script

:: 1. Set up Python and install requirements
echo Setting up Python environment...

:: Navigate to the Python scripts directory
cd %DEPLOYMENT_TARGET%\python-scripts

:: Install Python requirements if requirements.txt exists
if exist requirements.txt (
    echo Found requirements.txt, installing dependencies...
    %DEPLOYMENT_TARGET%\..\Python36\python.exe -m pip install -r requirements.txt --no-warn-script-location
) else (
    echo No requirements.txt found. Skipping pip install.
)

:: 2. Create necessary directories
echo Creating required directories...
if not exist %DEPLOYMENT_TARGET%\App_Data\databases (
    mkdir %DEPLOYMENT_TARGET%\App_Data\databases
)

:: 3. Convert any Jupyter notebooks to Python scripts (if they exist)
if exist convert_notebooks.py (
    echo Converting Jupyter notebooks to Python scripts...
    %DEPLOYMENT_TARGET%\..\Python36\python.exe convert_notebooks.py
)

echo Custom deployment completed.
exit /b 0