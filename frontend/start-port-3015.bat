@echo off
title CryptoFund Nexus - Port 3015
color 0A

echo Starting CryptoFund Nexus on port 3015...

rem Kill any existing processes on port 3015
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3015') do (
    taskkill /F /PID %%a >nul 2>&1
)

rem Set environment variables
set PORT=3015
set BROWSER=none
set SKIP_PREFLIGHT_CHECK=true
set DANGEROUSLY_DISABLE_HOST_CHECK=true
set REACT_APP_NODE_ENV=development

echo Environment configured for port 3015
echo Starting React development server...

rem Start the application
npm start

pause