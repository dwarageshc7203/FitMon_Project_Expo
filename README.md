# RMP System - Remote Medical Practice System

A real-time patient monitoring system for remote rehabilitation exercises, featuring computer vision-based rep counting, form analysis, and muscle activation monitoring via FSR sensors.

## 📋 System Overview

The RMP System enables **exactly 1 patient and 1 doctor** to work together:

- **Patient**: Performs bicep curls in front of webcam, which tracks reps and form accuracy using MediaPipe Pose
- **ESP32**: Reads FSR (Force Sensitive Resistor) sensor data and sends muscle activation readings
- **Doctor**: Views live dashboard with real-time updates of reps, form accuracy, and FSR sensor chart

## 🏗️ Project Structure

```
rmp-system/
├── backend/
│   ├── src/
│   │   ├── main.ts              # NestJS entry point
│   │   ├── app.module.ts         # Main application module
│   │   ├── ws.gateway.ts         # WebSocket gateway for live updates
│   │   ├── iot.controller.ts     # ESP32 sensor data endpoint
│   │   └── cv.controller.ts      # Patient CV data endpoint
│   ├── public/
│   │   ├── patient.html          # Patient webcam page
│   │   └── doctor.html           # Doctor dashboard
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── esp32/
│   └── fsr_sensor.ino            # ESP32 Arduino code
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **ESP32** development board
- **FSR sensor** (Force Sensitive Resistor)
- **Arduino IDE** with ESP32 board support

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   ```
   SENSOR_API_KEY=changeme123  # Change to a secure key
   GEMINI_API_KEY=your_gemini_api_key_here  # Get from https://makersuite.google.com/app/apikey
   PORT=3000
   ```
   
   **To get a Gemini API key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the key and paste it into `.env`

4. **Build the project:**
   ```bash
   npm run build
   ```

5. **Start the server:**
   ```bash
   npm run start:dev
   ```
   
   Or for production:
   ```bash
   npm run build
   npm run start:prod
   ```

6. **Access the application:**
   - Patient page: `http://localhost:3000/patient.html`
   - Doctor dashboard: `http://localhost:3000/doctor.html`

### ESP32 Setup

1. **Install ESP32 Board Support in Arduino IDE:**
   - Go to `File` → `Preferences`
   - Add this URL to "Additional Board Manager URLs":
     ```
     https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
     ```
   - Go to `Tools` → `Board` → `Boards Manager`
   - Search for "ESP32" and install "esp32 by Espressif Systems"

2. **Configure the sketch:**
   - Open `esp32/fsr_sensor.ino` in Arduino IDE
   
   - **IMPORTANT: Find your server's IP address first:**
     - **Quick method**: Run the helper script in project root:
       - **Windows**: Double-click `find-server-ip.bat` or run it from command line
       - **Mac/Linux**: Run `./find-server-ip.sh` (make executable first: `chmod +x find-server-ip.sh`)
     - **Manual method**:
       - **Windows**: Run `ipconfig` in PowerShell/CMD, find "IPv4 Address"
       - **Mac/Linux**: Run `ifconfig` or `ip addr show`
     - This must be on the **SAME network** the ESP32 will connect to!
   
   - Update these constants in the code:
     ```cpp
     const char* WIFI_SSID = "YOUR_WIFI_SSID";          // Same WiFi ESP32 will use
     const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";   // Same WiFi password
     const char* SERVER_URL = "http://YOUR_SERVER_IP:3000";  // Your computer's IP on same network
     const char* API_KEY = "changeme123";  // Must match backend .env SENSOR_API_KEY
     ```
   
   - **Example**: If your computer IP is `192.168.1.100`, use:
     ```cpp
     const char* SERVER_URL = "http://192.168.1.100:3000";
     ```
   
   - **⚠️ Network Requirements:**
     - ESP32 and server computer MUST be on the same WiFi network
     - Both must be on same subnet (e.g., both `192.168.1.x` OR both `192.168.186.x`)
     - If ESP32 shows IP like `192.168.186.84` but server is `192.168.1.3`, they're on different networks!

3. **Hardware Connections:**
   - Connect FSR sensor to **GPIO34** (or change `FSR_PIN` in code)
   - Connect one FSR terminal to GPIO34
   - Connect other FSR terminal through a **10kΩ pull-down resistor** to GND
   - Connect the junction between FSR and resistor to GPIO34

4. **Upload to ESP32:**
   - Select your ESP32 board: `Tools` → `Board` → `ESP32 Arduino` → `ESP32 Dev Module`
   - Select the correct port: `Tools` → `Port`
   - Click Upload

5. **Monitor Serial Output:**
   - Open Serial Monitor (`Tools` → `Serial Monitor`)
   - Set baud rate to **115200**
   - Verify WiFi connection and data transmission

## 📡 API Endpoints

### POST `/iot/reading`
Receives FSR sensor readings from ESP32.

**Headers:**
- `x-api-key`: API key (must match `SENSOR_API_KEY` in `.env`)
- `Content-Type`: `application/json`

**Body:**
```json
{
  "value": 1234.5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sensor reading received and broadcasted",
  "timestamp": 1234567890
}
```

### POST `/cv/update`
Receives rep count and form accuracy from patient page.

**Headers:**
- `x-api-key`: API key (must match `SENSOR_API_KEY` in `.env`)
- `Content-Type`: `application/json`

**Body:**
```json
{
  "reps": 10,
  "formAccuracy": 85
}
```

**Response:**
```json
{
  "success": true,
  "message": "CV update received and broadcasted",
  "timestamp": 1234567890
}
```

### POST `/session/generate-report`
Generates AI-powered physiotherapy session report and adaptive plan using Google Gemini.

**Headers:**
- `Content-Type`: `application/json`

**Body:**
```json
{
  "height": 172,
  "weight": 72,
  "bmi": 24.3,
  "fitness_level": "advanced",
  "cause": "Post ACL recovery",
  "goal": "Achieve 80 degree knee flexion",
  "accuracy_rate": 78,
  "activation_rate": 66
}
```

**Response:**
```json
{
  "session_summary": "Patient maintained good form but fatigue appeared in later reps. Knee flexion progressing with limited eccentric stability.",
  "goal_status": "in_progress",
  "performance_insights": "Activation rate below expected for advanced level; improve warm-up and tempo control.",
  "ai_reasoning": "Advanced status with incomplete goal → needs higher challenge.",
  "adaptive_plan": {
    "case_type": "strong",
    "plan": "Raise flexion target to 85°, add 2 slow-tempo sets, single-leg balance drills."
  }
}
```

**Note:** Requires `GEMINI_API_KEY` to be set in `.env` file. See setup instructions below.

## 🔌 WebSocket Events

The system uses Socket.IO for real-time communication:

- **Event: `cv-update`**
  - Sent when patient page sends rep/form data
  - Payload: `{ reps: number, formAccuracy: number, timestamp: number }`

- **Event: `sensor-data`**
  - Sent when ESP32 sends sensor reading
  - Payload: `{ timestamp: number, value: number }`

## 🎯 How to Use

### For Patient:

1. Open `http://localhost:3000/patient.html` in a browser
2. Click **"Start Camera"** and allow webcam access
3. Position yourself so your upper body is visible
4. Perform bicep curls
5. Watch the rep count and form accuracy update in real-time
6. Data is automatically sent to the backend every 2 seconds

### For Doctor:

1. Open `http://localhost:3000/doctor.html` in a browser
2. The dashboard will automatically connect via WebSocket
3. Monitor:
   - **Total Reps**: Number of bicep curls completed
   - **Form Accuracy**: Percentage score (0-100%)
   - **Muscle Activation**: Current FSR sensor reading
   - **Real-Time Chart**: FSR sensor data over time

## 🔒 Security Notes

- The API key is currently sent in plain text in requests
- For production, consider:
  - Using HTTPS/WSS
  - Implementing proper authentication (JWT tokens)
  - Rate limiting
  - Input validation and sanitization

## 🐛 Troubleshooting

### Backend Issues:

- **Port already in use**: Change `PORT` in `.env` or kill the process using port 3000
- **WebSocket connection fails**: Ensure CORS is configured correctly and firewall allows connections

### ESP32 Issues:

- **WiFi connection fails**: Verify SSID and password are correct
- **Connection refused (-1) or Cannot reach server**: 
  - **CRITICAL: Ensure ESP32 and server are on the SAME network**
    - Check ESP32 IP (from Serial Monitor): Should be in same subnet as server
    - Example: If ESP32 is `192.168.186.84` and server is `172.20.10.14`, they're on different networks!
    - **Both devices MUST be on the same WiFi network/subnet to communicate**
  
  - **If ESP32 and laptop are on different networks:**
    - **Option A: Connect laptop to ESP32's network** (Recommended)
      1. Check Serial Monitor to see which network ESP32 is connected to
      2. Disconnect laptop from current WiFi
      3. Connect laptop to the SAME network as ESP32
      4. Run `ipconfig` (Windows) or `ifconfig` (Mac/Linux) to get new laptop IP
      5. Update `SERVER_URL` in ESP32 code with the new laptop IP
      6. Re-upload ESP32 sketch
    
    - **Option B: Connect ESP32 to laptop's network**
      1. Find your laptop's WiFi network name (SSID) and password
      2. Update `WIFI_SSID` and `WIFI_PASSWORD` in ESP32 code
      3. Keep `SERVER_URL` as your laptop's current IP (e.g., `172.20.10.14`)
      4. Re-upload ESP32 sketch
      5. ESP32 should now connect to laptop's network
  
  - **Quick Network Check:**
    - ESP32 IP from Serial Monitor: `192.168.186.84` → Network: `192.168.186.x`
    - Laptop IP from `ipconfig`: `172.20.10.14` → Network: `172.20.10.x`
    - **These don't match!** Both need to be on same network (same first 3 numbers)
  
  - **Find your server's IP address:**
    - **Windows**: Open PowerShell/CMD and run: `ipconfig`
      - Look for "IPv4 Address" under your active network adapter
      - Use this IP in `SERVER_URL` (e.g., `http://192.168.1.XXX:3000`)
    - **Mac/Linux**: Run `ifconfig` or `ip addr show`
      - Look for your WiFi adapter's `inet` address
    
  - **Verify server is accessible:**
    - Test in browser: `http://YOUR_SERVER_IP:3000/patient.html`
    - If this doesn't work, the server isn't accessible on your network
  
  - **Update ESP32 code with correct IP:**
    - Open `esp32/fsr_sensor.ino`
    - Change `SERVER_URL` to match your server's IP:
      ```cpp
      const char* SERVER_URL = "http://YOUR_ACTUAL_IP:3000";
      ```
    - Re-upload the sketch to ESP32
  
  - **Firewall/Network issues:**
    - Windows Firewall: Allow Node.js through firewall or temporarily disable firewall to test
    - Antivirus: Some antivirus software blocks network connections
    - Router settings: Ensure AP isolation/client isolation is disabled
  
  - **Still having issues?**
    - Verify backend is running: Check console for "RMP System backend running"
    - Test from another device on same network
    - Try pinging server IP from ESP32's network (may require router access)
    - Ensure backend listens on `0.0.0.0` (already configured in `main.ts`)

- **Sensor readings are 0 or constant**: 
  - Check FSR wiring
  - Verify pull-down resistor is connected
  - Test with multimeter

### Patient Page Issues:

- **Webcam not working**: Check browser permissions and ensure no other app is using the camera
- **MediaPipe not loading**: Check internet connection (MediaPipe is loaded from CDN)
- **Reps not counting**: Ensure full range of motion is visible in camera frame

### Doctor Dashboard Issues:

- **No data received**: 
  - Check WebSocket connection status (top indicator)
  - Verify backend is running
  - Check browser console for errors

## 📝 Notes

- MediaPipe Pose is loaded from CDN, so an internet connection is required for the patient page
- Sensor data is sent every 200ms from ESP32 (configurable in `.ino` file)
- Patient page sends updates every 2 seconds
- The system is designed for exactly 1 patient and 1 doctor session
- No database is required - all data is streamed in real-time

## 🛠️ Development

### Running in Development Mode:

```bash
cd backend
npm run start:dev
```

This will watch for file changes and auto-reload.

### Building for Production:

```bash
cd backend
npm run build
npm run start:prod
```

## 📄 License

MIT License - feel free to use and modify as needed.

## 🤝 Contributing

This is a complete implementation with no placeholders. All code is production-ready and fully functional.

---

**Built with:**
- NestJS (Backend)
- Socket.IO (WebSocket)
- MediaPipe Pose (Computer Vision)
- Chart.js (Visualization)
- ESP32 (IoT Sensor)

