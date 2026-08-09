# App SignalMap™

You are an expert full-stack developer building a complete, secure, open-source web application for educational, research, and defensive privacy protection purposes only.

Project name: "Privacy Signal Monitor" – a centralized web dashboard for monitoring mobile network signals, detecting potential surveillance (like IMSI-catchers/Stingray), analyzing cell tower data for triangulation, extracting metadata, and providing privacy defense tools.

Core goals (strictly legal and defensive):
- Help users detect if they are being tracked via mobile networks.
- Educate about mobile privacy risks.
- Monitor own devices and local GSM signals.
- Analyze publicly available or self-captured data.
- NO offensive tracking of others – include warnings and disclaimers.

Tech stack:
- Backend: Python 3 with Flask (lightweight, easy to extend).
- Frontend: HTML5, CSS (Bootstrap 5), JavaScript (with Chart.js for visualizations and Leaflet.js for maps).
- Database: SQLite for storing logs (captured IMSI, cell data, alerts).
- Hardware support: RTL-SDR USB dongle for passive GSM signal capture.
- Deployment: Docker support for easy installation, plus manual install instructions for Ubuntu/Linux.

Integrate these open-source tools/modules into one unified web dashboard:

1. IMSI Catcher detection and passive signal monitoring:
   - Base on https://github.com/X3RX3SSec/IMSI_Catcher (include its web dashboard as the core live view).
   - Use gr-gsm + rtl-sdr for passive scanning of local GSM frequencies.
   - Live table: Show detected IMSI/TMSI, MCC/MNC (country/operator), signal strength, timestamp.
   - Alert system: Flag suspicious activity (e.g. unknown cell IDs, rapid tower changes suggesting fake base station).

2. Cell tower triangulation and location analysis:
   - Integrate OpenCellID API (user must register for free API key).
   - Form: Input MCC/MNC/LAC/CellID (or upload captured data) → display estimated location on interactive Leaflet map.
   - Historical log viewer with map overlay of captured towers.

3. Metadata analysis:
   - ExifTool integration: File upload form (images, PDFs, docs) → extract and display metadata (GPS, device info, timestamps).
   - Optional: Basic OSINT module (e.g. username/email lookup via public APIs if available).

4. Defensive tools:
   - IMSI-catcher detector mode (inspired by AIMSICD): Compare captured cell data against known legitimate towers.
   - Privacy checklist and alerts (e.g. "Frequent silent SMS?" or "Unusual tower handovers?").
   - Export logs as CSV/JSON.

Dashboard layout:
- Sidebar menu: Live Scan, Triangulation Map, Metadata Analyzer, Logs & Alerts, Settings, About/Disclaimer.
- Real-time updates via WebSockets or polling.
- Responsive design for desktop/mobile.

Security and ethics:
- Prominent disclaimer on every page: "For educational and defensive use only. Active signal interception may be regulated – use passively and only on your own networks/devices."
- No user authentication by default (add optional simple login).
- All data stored locally (no cloud upload).

Deliverables – generate a complete project structure:
1. Full folder structure with all files (app.py, templates/, static/, requirements.txt, Dockerfile).
2. Detailed README.md with:
   - Step-by-step installation on Ubuntu (apt dependencies, pip, RTL-SDR drivers like rtl-sdr, gr-gsm, kalibrate-rtl).
   - How to get and configure OpenCellID API key.
   - Running the app (flask run or docker compose).
   - Hardware setup (RTL-SDR dongle calibration and frequency scanning).
   - Troubleshooting common issues.
3. All necessary code with comments.
4. Make it modular and easy to extend.

Output the entire project as zipped code or clearly separated files, ready to clone and run.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://cell-shield-guardian.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b098d8d9-b551-4f11-87e8-34f8a12690d8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `SignalMap/App` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
