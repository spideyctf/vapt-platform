@echo off
echo 🚀 Setting up VAPT Dashboard...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% equ 0 (
    echo ✅ Dependencies installed successfully
    echo.
    echo 🎉 Setup complete! You can now run the application:
    echo    npm start
    echo.
    echo 📖 For more information, see README.md
) else (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

pause
