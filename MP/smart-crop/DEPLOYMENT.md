# 🚀 Smart Crop - Full Production Deployment Guide

Follow these steps to take your local "Smart Crop" project live.

---

## 1. Cloud Database (MongoDB Atlas)
1.  **Sign Up**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2.  **Create Cluster**: Deploy a free "M0" cluster. Choose a provider (AWS/Google/Azure) and a region near you.
3.  **Database User**: Go to **Database Access** and create a user (e.g., `admin`) with a strong password. **Important**: Remember this password.
4.  **IP Whitelist**: Go to **Network Access** and click **Add IP Address**. Click **Allow Access from Anywhere** (0.0.0.0/0) for initial setup.
5.  **Connection String**: Go to **Database**, click **Connect** -> **Drivers** -> **Node.js**. Copy the connection string.
    *   It looks like: `mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/smartcrop?retryWrites=true&w=majority`
    *   Replace `<password>` with your actual password.

---

## 2. Deploy Python AI Model (Render.com)
1.  **Push Code**: Ensure your `ai-model` folder is pushed to a GitHub repository.
2.  **Create Web Service**: In [Render](https://dashboard.render.com/), click **New +** -> **Web Service**.
3.  **Connect Repo**: Select your GitHub repository.
4.  **Settings**:
    *   **Name**: `smart-crop-ai`
    *   **Root Directory**: `ai-model`
    *   **Environment**: `Python 3`
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `python app.py`
5.  **Environment Variables**:
    *   `NODE_ENV`: `production`
    *   `PYTHON_VERSION`: `3.10.12` (or similar)
6.  **Deploy**: Once deployed, copy the **AI Service URL** (e.g., `https://smart-crop-ai.onrender.com`).

---

## 3. Deploy Node.js Backend (Render.com)
1.  **Create Web Service**: Click **New +** -> **Web Service**.
2.  **Connect Repo**: Select the same GitHub repository.
3.  **Settings**:
    *   **Name**: `smart-crop-backend`
    *   **Root Directory**: `backend`
    *   **Environment**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
4.  **Environment Variables**:
    *   `MONGO_URI`: (Your MongoDB Atlas string from Step 1)
    *   `JWT_SECRET`: (Any long random string)
    *   `FLASK_URL`: (The AI Service URL from Step 2)
    *   `FRONTEND_URL`: `https://smart-crop-platform.vercel.app` (Placeholder for now)
    *   `NODE_ENV`: `production`
5.  **Deploy**: Once deployed, copy the **Backend API URL** (e.g., `https://smart-crop-backend.onrender.com`).

---

## 4. Deploy React Frontend (Vercel)
1.  **Sign Up**: Go to [Vercel](https://vercel.com/) and connect your GitHub.
2.  **New Project**: Click **Add New** -> **Project**.
3.  **Import**: Select your GitHub repository.
4.  **Settings**:
    *   **Root Directory**: `frontend`
    *   **Framework Preset**: `Vite`
5.  **Environment Variables**:
    *   `VITE_API_BASE_URL`: (The Backend API URL from Step 3)
6.  **Deploy**: Once finished, Vercel will give you a public URL (e.g., `https://smart-crop-platform.vercel.app`).

---

## 5. Final Connection Bridge
1.  **Go back to Render Dashboard** for the **Backend** service.
2.  **Update Environment Variable**:
    *   Change `FRONTEND_URL` to your actual Vercel URL.
3.  The backend will auto-restart and everything is now connected!

### ✅ Verification
1.  Open your Vercel link.
2.  Register a new account.
3.  Try "Crop Recommendation" (requires AI & DB).
4.  Try "Disease Detection" (requires AI, Backend & Uploads).
