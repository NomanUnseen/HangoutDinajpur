# Dinajpur Portal & Girgiti Chine Rakhun Platform (দিনাজপুর পোর্টাল ও গিরগিটি চিনে রাখুন)

A high-performance modern React & Vite web application featuring:
1. **Dinajpur District Guide & Tourism Portal**:
   - 13 Upazilas explorer with detailed historical & tourist attractions.
   - Interactive OpenWeatherMap 3-Day Forecast & Live Weather Widget.
   - Emergency Hotline & Support Modal (Dinajpur Medical College Hospital, Fire Service, Ambulance, Police).
2. **Girgiti Chine Rakhun (গিরগিটি চিনে রাখুন)**:
   - Bilingual (Bangla / English) reporting and moderation system for exposing relationship cheating, financial scams, fake profiles, and serial deceivers.
   - PII protection & evidence verification tracking.

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or bun

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your OpenWeatherMap API key (optional; has built-in realistic fallback live feed):
```env
VITE_OPENWEATHER_API_KEY=your_openweathermap_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` (or `http://localhost:5173`).

### 4. Build for Production
```bash
npm run build
```

---

## 📤 Upload / Push to GitHub

To push this project to your GitHub repository:

```bash
# 1. Initialize and switch to main branch (if not already done)
git branch -M main

# 2. Add your remote GitHub repository URL
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

# 3. Commit any unstaged changes
git add .
git commit -m "feat: complete application source code"

# 4. Push to GitHub
git push -u origin main
```
*(If the remote repository already contains files like a default README or license, run `git pull origin main --rebase` before pushing).*
