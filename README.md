# AI Career Guidance System

A premium, AI‑powered career counseling platform that gathers a student's profile (skills, education, interests, budget, preferences) and generates a structured, multi‑stage career report with personalized recommendations, learning roadmaps, and actionable plans.

---

## ✨ Key Features
- **Multi‑Step Assessment Form** – Smooth transitions, real‑time validation, and interactive tag selectors.
- **8‑Stage AI Pipeline Simulator** – Visual progress tracker that mimics prompt execution (skills inventory → aptitude check → market validation → …).
- **Smart Recommendations Engine** – Rule‑based fallback and Gemini LLM integration for custom career paths, salary insights, degree suggestions, and university options.
- **Dynamic Fallback for Gemini API** – Automatic retry using an alternate Gemini endpoint when the primary model returns a 503 (high demand) error.
- **Step‑by‑Step Roadmaps** – 6‑month action plans and 3‑year timelines.
- **Simulated CRM Lead Capture** – Logs lead data to a mock Google Sheets connector.
- **Modern Premium UI** – Dark theme, glass‑morphic cards, vibrant gradients, responsive layout, and print‑optimized styles.

---

## 🏗️ System Architecture
1. **Frontend (`index.html`)** – Semantic HTML for the hero, wizard, loading screen, and report dashboard.
2. **Styling (`style.css`)** – Vanilla CSS with custom properties, responsive grid, hover effects, and `@media print` rules.
3. **Logic Engine (`app.js`)** – Handles form validation, state management, Gemini request with automatic fallback, and report rendering.
4. **Backend Proxy (`server.js`)** – Simple Express server exposing `/api/gemini` and `/api/gemini-alt` routes that forward prompts to the configured Gemini model(s).

---

## 📦 Prerequisites
- **Node.js ≥ 18** (LTS recommended)
- **npm** (comes with Node)
- A **Gemini API key** with access to at least one model.

---

## 🔧 Installation & Setup
1. **Clone the repository** (or navigate to the existing workspace):
   ```bash
   git clone <repo-url>   # or just open the folder
   cd Project1_VOC
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure environment variables** – copy `.env.example` to `.env` and fill in the required keys:
   ```text
   GEMINI_API_KEY=your_gemini_api_key
   # Optional: alternate model endpoint (e.g., a different Gemini model or another LLM)
   GEMINI_ALT_ENDPOINT=https://your‑alt‑model‑url
   ```
   The server reads these values to forward requests.

---

## 🚀 Running Locally
There are two ways to run the project:

### 1️⃣ Development Server (Node + Express)
```bash
npm start
```
- Starts `server.js` on **http://localhost:3000**.
- The server proxies `/api/gemini` and `/api/gemini-alt` to the Gemini API using the keys defined in `.env`.
- The frontend is served as static files from the project root (open `index.html` in a browser or use a live‑server extension).

### 2️⃣ Pure Static Frontend (No backend needed for UI testing)
```bash
npx serve .
```
- Opens the static site on a local port.  The Gemini calls will fail unless the proxy server is running, but you can still explore the UI and test the fallback logic by manually disabling network requests.

---

## 🔄 Gemini API – Automatic Fallback
The `fetchGeminiResponse` function in `app.js` now attempts the primary endpoint (`/api/gemini`). If it receives a **503** response (model under high demand) or any network error, it automatically retries the secondary endpoint (`/api/gemini‑alt`).

- **Primary Endpoint** – Configured in `server.js` to use the default Gemini model.
- **Fallback Endpoint** – Can point to a different Gemini model version or even another LLM provider. Set `GEMINI_ALT_ENDPOINT` in `.env` to control the URL.
- Errors are logged to the console; the UI will show rule‑based recommendations if both endpoints fail.

---

## 📄 Generating the Report
1. Fill out the multi‑step form.
2. Click **Submit & Analyze** on the final step.\n- The app sends the built prompt to the Gemini proxy.
- If the Gemini model returns a JSON response, the report is rendered with rich UI components.
- If Gemini is unavailable, the app falls back to the built‑in rule‑based recommendation engine.

---

## 🖨️ Print / Export
The stylesheet includes `@media print` rules that hide navigation elements and ensure the report prints cleanly on A4 paper or PDF.

---

## 🤝 Contributing
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/awesome-feature
   ```
3. Make your changes and run the lint/tests (if added).
4. Submit a pull request with a clear description.

---

## 📜 License
This project is licensed under the **MIT License** – feel free to use, modify, and distribute.

---

## 🙋‍♀️ Support
If you encounter the Gemini **503** error frequently, consider:
- Adding a more robust secondary model endpoint.
- Increasing request timeout or adding exponential backoff.
- Monitoring Gemini status pages for outage reports.

For any other issues, open an issue in the repository or contact the maintainer.
