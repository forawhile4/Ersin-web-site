@echo off
echo Finding and stopping the process on port 4321...

for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":4321"') do (
    set PID=%%a
)

if defined PID (
    if %PID% neq 0 (
        echo Process found with PID: %PID%. Stopping it now...
        taskkill /PID %PID% /F
    ) else (
        echo No active process found on port 4321.
    )
) else (
    echo No process found listening on port 4321.
)

echo.
echo Operation complete.
pause
