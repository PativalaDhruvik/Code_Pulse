# CodePulse Studio ⚡

[![Vercel Deployment](https://img.shields.io/badge/Deploy%20with-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/new)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Django](https://img.shields.io/badge/Django-6.0-092E20?style=for-the-badge&logo=django)](https://www.djangoproject.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Python AST](https://img.shields.io/badge/Python-AST%20%2B%20Gemini-3776AB?style=for-the-badge&logo=python)](https://python.org)

> **CodePulse Studio** is an AI-assisted Python code diagnostic, error catalog, and interactive debugging platform. It combines Python's Native Abstract Syntax Tree (AST) parser with Google Gemini AI models to detect syntax errors, code smells, and performance bottlenecks, delivering 3-tier educational explanations (Newbie, Comfortable, and Facts).

---

## 🌐 Live Demo & Repository

- **GitHub Repository**: [PativalaDhruvik/Code_Pulse](https://github.com/PativalaDhruvik/Code_Pulse.git)
- **Live Demo URL**: 🚀 [https://code-pulse-eta.vercel.app/](https://code-pulse-eta.vercel.app/)

---

## ✨ Key Features

1. **⚡ Real-Time Code Analysis Engine**
   - Combines deterministic **Python AST parsing** with **Google Gemini AI LLM diagnostics**.
   - Pinpoints exact line numbers, column cursor offsets, and erroneous code words.
   - Computes code quality scores (0 to 100) and cleanliness status.

2. **🎓 3-Tier Educational Explanations**
   - **Newbie Mode**: Simple, jargon-free explanations for beginner programmers.
   - **Comfortable Mode**: Technical breakdown explaining *why* the issue occurs.
   - **Facts / Solutions**: Direct actionable fix and refactored code block.

3. **📚 Error Library & Interactive Puzzles**
   - Pre-seeded searchable catalog of common Python errors.
   - Interactive practice puzzles to hone debugging skills.

4. **📊 Analytics & Diagnostic History**
   - Built-in analytics dashboard powered by **Recharts**.
   - Saved submission logs and diagnostic metrics per user session.

---

## 🏗️ Tech Stack & Architecture

- **Frontend**: React 19, React Router v7, Recharts, Vite 6, Modern Dark Glassmorphism UI (Vanilla CSS)
- **Backend**: Django 6.0 REST Framework, Python `ast`, Google Gemini AI API (`urllib.request`)
- **Database**: SQLite (Automated seeding + `/tmp` serverless runtime storage)
- **Deployment Platform**: **Vercel** (Serverless Python API + Static Build)

```
[ Frontend: React 19 + Vite ] ──(REST API)──> [ Vercel Serverless Function: api/index.py ]
                                                        │
                                                        ▼
                                            [ Django 6 REST Backend ]
                                            ├── Python AST Diagnostics
                                            ├── Google Gemini AI API
                                            └── SQLite DB (/tmp/db.sqlite3)
```

---

## 🚀 Deployment Guide on Vercel (Instead of Render)

CodePulse is pre-configured for seamless, zero-config single-command deployment on **Vercel**.

### Step 1: Push Code to GitHub
Ensure your repository is up to date:
```bash
git add .
git commit -m "Configure project for Vercel deployment"
git push origin main
```

### Step 2: Deploy on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Click **Add New Project** and select your GitHub repository: `PativalaDhruvik/Code_Pulse`.
3. Vercel will automatically detect `vercel.json` and configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. *(Optional)* In **Environment Variables**, set:
   - `GEMINI_API_KEY`: *(Your Google Gemini API key)*
5. Click **Deploy**. Vercel will build both the React Frontend and the Django Serverless Backend automatically!

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18+) & `npm`
- Python 3.10+

### Step-by-Step Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/PativalaDhruvik/Code_Pulse.git
   cd Code_Pulse
   ```

2. **Install Node Dependencies**
   ```bash
   npm install
   ```

3. **Setup Python Virtual Environment**
   ```bash
   cd backend
   python -m venv .venv
   
   # On Windows:
   .venv\Scripts\activate
   # On macOS/Linux:
   source .venv/bin/activate

   pip install -r requirements.txt
   cd ..
   ```

4. **Run Development Server (Concurrent Frontend & Backend)**
   ```bash
   npm run dev
   ```
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:8000/api

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
