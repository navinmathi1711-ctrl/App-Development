@echo off
title Folio Notes Launcher
echo ========================================================
echo               FOLIO NOTES - LAUNCHER
echo ========================================================
echo.
echo Starting Backend API (Port 5000)...
start "Folio Notes API" cmd /k "cd backend && npm start"

echo Starting Frontend Dev Server (Port 5173)...
start "Folio Notes React" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are launching.
echo Backend:  http://localhost:5000/api/notes
echo Frontend: http://localhost:5173
echo.
pause
