@echo off
:: Minimize the command window
if not "%minimized%"=="" goto :minimized
set minimized=true
start /min cmd /C "%~dpnx0"
goto :EOF
:minimized

echo Starting MongoDB...
net start MongoDB

echo Starting frontend & backend...
cd /d "%~dp0"
start /B cmd /C "npm run dev"

echo Waiting 5 seconds before opening Chrome...
timeout /t 5 /nobreak >nul

echo Opening Chrome at localhost:3000...
start chrome http://localhost:3000

pause
