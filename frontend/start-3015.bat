@echo off
title CryptoFund Nexus - Frontend Port 3015
color 0A

echo.
echo ================================================================
echo  CryptoFund Nexus - Starting Frontend on Port 3015
echo ================================================================
echo.

echo Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Setting up environment for port 3015...
set PORT=3015
set BROWSER=none
set SKIP_PREFLIGHT_CHECK=true
set DANGEROUSLY_DISABLE_HOST_CHECK=true

echo.
echo ================================================================
echo  Frontend starting on: http://localhost:3015
echo ================================================================
echo.

echo Opening browser...
start "" "http://localhost:3015"

echo Starting React development server...
call npm start

pause