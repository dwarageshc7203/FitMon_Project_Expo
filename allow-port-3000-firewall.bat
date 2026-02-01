@echo off
echo ========================================
echo   Adding Windows Firewall Rule for Port 3000
echo ========================================
echo.
echo This will allow incoming connections on port 3000
echo Required for ESP32 to connect to the backend server.
echo.
pause

netsh advfirewall firewall add rule name="RMP Backend Server Port 3000" dir=in action=allow protocol=TCP localport=3000

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Firewall rule added successfully!
    echo.
    echo Port 3000 is now open for incoming connections.
) else (
    echo.
    echo ❌ Failed to add firewall rule.
    echo You may need to run this as Administrator.
    echo Right-click and select "Run as administrator"
    echo.
)

pause

