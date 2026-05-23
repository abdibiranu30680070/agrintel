# AgriIntel Ethiopia

AI-Driven Precision Agriculture for Ethiopian Smallholders.

## Project Structure
- `backend/`: Node.js Express API.
- `ai-service/`: Python FastAPI AI engine.
- `frontend-web/`: React admin dashboard.
- `mobile-app/`: React Native (Expo) mobile app for farmers.

## Getting Started

### 1. AI Service (Python FastAPI)
1. `cd ai-service`
2. `python3 -m venv venv`
3. `source venv/bin/activate`
4. `pip install -r requirements.txt`
5. `python main.py` (Runs on port 8000)

### 2. Backend (Node.js Express)
1. `cd backend`
2. `npm install`
3. `npm start` (Runs on port 5000)

### 3. Frontend (React/Vite)
1. `cd frontend-web`
2. `npm install`
3. `npm run dev` (Runs on port 5173)

### 4. Mobile App (React Native/Expo)
1. `cd mobile-app`
2. `npm install`
3. `npx expo start`

## Tech Stack
- **Frontend**: React, Vite, Lucide Icons, Axios.
- **Mobile**: React Native, Expo, Lucide Icons, Axios.
- **Backend**: Node.js, Express, Axios.
- **AI**: Python, FastAPI, Scikit-learn, Pandas, Numpy.
- **Database**: PostgreSQL (See `docs/db_schema.sql`).
# agrintel
