@echo off
echo ========================================
echo   Network Connection Checker
echo ========================================
echo.
echo Checking your current network connection...
echo.
ipconfig | findstr /i "Wi-Fi" /A:10
echo.
echo ========================================
echo.
echo Current IP Address:
ipconfig | findstr /i "IPv4"
echo.
echo ========================================
echo.
echo If your ESP32 shows IP 192.168.186.84, your laptop
echo should also be on a 192.168.186.x network!
echo.
pause

