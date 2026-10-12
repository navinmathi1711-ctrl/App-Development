@echo off
setlocal
title Push 6 Projects to GitHub
color 0b

echo ======================================================================
echo             Push App Development Projects to GitHub
echo ======================================================================
echo.

where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;%PATH%"
)

cd /d "%~dp0"

echo Current folder: %CD%
echo.
echo Step 1: Make sure you created an empty repository on GitHub:
echo         https://github.com/new
echo.
set /p REPO_URL="Step 2: Paste your GitHub repository URL: "

if "%REPO_URL%"=="" (
    echo [ERROR] No URL provided. Aborting.
    pause
    exit /b
)

echo.
echo [1/3] Setting remote origin...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo [2/3] Ensuring branch is main...
git branch -M main

echo [3/3] Pushing to GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ======================================================================
    echo  SUCCESS! All 6 projects are now pushed to your GitHub repository!
    echo ======================================================================
) else (
    echo.
    echo ======================================================================
    echo  Push encountered an issue.
    echo  If prompted, complete the GitHub sign-in in your browser or enter
    echo  your GitHub Personal Access Token (PAT).
    echo ======================================================================
)

echo.
pause
