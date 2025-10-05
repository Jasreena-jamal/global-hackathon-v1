# Timeless Tales - Memory Keeper AI

An AI-powered interactive web app that helps grandparents to record/write their cherished memories and turns them into beautiful blog-style stories for their families to download and store with them.


## Project Overview

**Timeless Tales** allows users (especially grandparents) to:
- Speak or type their memories.
- Have an AI turn them into heartwarming written stories.
- Download or share the generated stories.
- Preserve family history with love and simplicity.


## Tech Stack

**Frontend:** React + Vite + CSS  
**Backend:** Node.js + Express  
**AI Model:** OpenAI GPT-4  
**Hosting:**  
- Frontend: Vercel 
- Backend: Render  

## Deployment

Backend: Deployed on Render
Frontend: Deployed on Vercel

Example Live Demo:
https://global-hackathon-v1-git-main-jasreenas-projects.vercel.app?_vercel_share=dA4gmiw8vn3NARRVUHpveyRVWNvi1NhC

##  Setup (for local development)

### 1. Clone repository
git clone https://github.com/Jasreena-jamal/global-hackathon-v1.git
cd memory-keeper

### 2. Install dependencies
For both frontend and backend:

cd frontend
npm install

cd ../backend
npm install

### 3. Create environment files
Frontend (frontend/.env):
VITE_API_URL=http://localhost:5000


Backend (backend/.env):
OPENAI_API_KEY=your_openai_api_key

### 4. Run locally
In two separate terminals:

Backend:
cd backend
npm start


Frontend:
cd frontend
npm run dev