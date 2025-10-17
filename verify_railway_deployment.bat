@echo off
echo Railway Deployment Verification Script
echo ====================================

if "%1"=="" (
    echo Usage: verify_railway_deployment.bat ^<your-railway-app-url^>
    echo Example: verify_railway_deployment.bat my-app-name.railway.app
    echo.
    echo Please provide your Railway app URL as a parameter.
    exit /b 1
)

echo Setting Railway app URL to %1
set RAILWAY_APP_URL=%1

echo Running verification...
node verify_railway_deployment.js

echo.
echo Verification complete.