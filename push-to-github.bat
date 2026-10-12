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

echo Repository: git@github.com:navinmathi1711-ctrl/App-Development.git
echo Pushing branch 'main' to GitHub...
echo.

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ======================================================================
    echo  SUCCESS! All 6 projects are now pushed to your GitHub repository!
    echo ======================================================================
) else (
    echo.
    echo ======================================================================
    echo  Push failed.
    echo  Please ensure your SSH key is added at: https://github.com/settings/ssh/new
    echo ======================================================================
)

echo.
pause
