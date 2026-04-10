@echo off
title EduTrack Platform - Dev Server
echo ==============================================
echo   EduTrack Platform - Starting Dev Server
echo ==============================================
echo.

REM Try common Node.js locations
set "NODE_EXE="

if exist "C:\Program Files\nodejs\node.exe" set "NODE_EXE=C:\Program Files\nodejs\node.exe"
if exist "C:\Program Files (x86)\nodejs\node.exe" set "NODE_EXE=C:\Program Files (x86)\nodejs\node.exe"
if exist "%APPDATA%\nvm\current\node.exe" set "NODE_EXE=%APPDATA%\nvm\current\node.exe"

REM If not found, try to find via where command
if "%NODE_EXE%"=="" for /f "tokens=*" %%i in ('where node 2^>nul') do set "NODE_EXE=%%i"

if "%NODE_EXE%"=="" (
    echo ERROR: Node.js not found. Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo Node.js found: %NODE_EXE%
echo.
echo Starting Next.js dev server on http://localhost:3000
echo.

"%NODE_EXE%" "node_modules\next\dist\bin\next" dev

pause
