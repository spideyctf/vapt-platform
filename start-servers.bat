@echo off
echo Starting VAPT Platform...

echo.
echo Installing backend dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Starting backend server...
start "VAPT Backend" cmd /k "npm start"

echo.
echo Starting frontend server...
cd ..
start "VAPT Frontend" cmd /k "npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this script (servers will continue running)
pause > nul
