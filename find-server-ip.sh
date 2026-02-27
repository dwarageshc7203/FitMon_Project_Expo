#!/bin/bash
# FitMon - Find Server IP Address
# This script shows your computer's IP address(es)
# Use this IP in the ESP32 SERVER_URL configuration

echo "========================================"
echo "  FitMon - Find Server IP Address"
echo "========================================"
echo ""
echo "This script shows your computer's IP address(es)."
echo "Use this IP in the ESP32 SERVER_URL configuration."
echo ""
echo "Active Network Adapters:"
echo "----------------------------------------"

# Try different commands based on OS
if command -v ip &> /dev/null; then
    # Modern Linux
    ip addr show | grep -E "inet [0-9]" | grep -v "127.0.0.1"
elif command -v ifconfig &> /dev/null; then
    # macOS or older Linux
    ifconfig | grep -E "inet [0-9]" | grep -v "127.0.0.1"
else
    echo "Error: Could not find 'ip' or 'ifconfig' command"
    exit 1
fi

echo ""
echo "========================================"
echo ""
echo "Instructions:"
echo "1. Find your active network adapter (usually 'wlan0' or 'eth0' on Linux, 'en0' on macOS)"
echo "2. Use the IP address shown above in your ESP32 code:"
echo "   const char* SERVER_URL = \"http://YOUR_IP_HERE:3000\";"
echo ""
echo "IMPORTANT: ESP32 must be on the SAME network as this computer!"
echo ""

