@echo off
echo ========================================
echo   RMP System - Find Server IP Address
echo ========================================
echo.
echo This script shows your computer's IP address(es).
echo Use this IP in the ESP32 SERVER_URL configuration.
echo.
echo Active Network Adapters:
echo ----------------------------------------
ipconfig | findstr /i "IPv4"
echo.
echo ========================================
echo.
echo Instructions:
echo 1. Find your active network adapter (usually "Wireless LAN" or "Ethernet")
echo 2. Use the IPv4 Address shown above in your ESP32 code:
echo    const char* SERVER_URL = "http://YOUR_IP_HERE:3000";
echo.
echo IMPORTANT: ESP32 must be on the SAME network as this computer!
echo.
pause

