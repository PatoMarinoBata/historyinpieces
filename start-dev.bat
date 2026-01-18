@echo off
cd /d "%~dp0"
echo Cleaning up...
taskkill /F /IM node.exe >nul 2>&1
rmdir /s /q .next >nul 2>&1
rmdir /s /q .turbo >nul 2>&1
echo ✓ Ready to start
echo.
set NODE_OPTIONS=--max-old-space-size=4096
