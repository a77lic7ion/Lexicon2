@echo off
setlocal
cd /d %~dp0
title LEXICON BATTLE STATION LAUNCHER

echo ======================================================
echo    LEXICON: INITIALIZING BATTLE STATION...
echo ======================================================
echo.

:: Check for Node.js
echo [1/3] VERIFYING NODE.JS ENVIRONMENT...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Node.js is not found on your system!
    echo Please install the latest LTS version from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo [OK] Node.js verified.
echo.

:: Install Dependencies
echo [2/3] SYNCHRONIZING ARSENAL (INSTALLING DEPENDENCIES)...
echo This may take a moment on the first run...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Dependency synchronization failed!
    echo Please check your internet connection or NPM configuration.
    echo.
    pause
    exit /b 1
)
echo [OK] Dependencies synchronized.
echo.

:: Launch App
echo [3/3] SPOOLING ENGINES (STARTING DEV SERVER)...
echo.
echo Launching browser at http://localhost:5173...
echo.
:: Give the server a moment to spin up before opening browser
timeout /t 3 /nobreak >nul
start http://localhost:5173

:: Start the dev server
call npm run dev

if %errorlevel% neq 0 (
    echo.
    echo [WARNING] Game session terminated unexpectedly.
    echo.
    pause
)

endlocal
