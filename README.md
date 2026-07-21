# AI Career Guidance Agent

An AI-powered career guidance agent built with **Node.js, Express, MongoDB (Mongoose), and the Google Gemini API**. The agent analyzes a student's profile and automatically orchestrates multiple modules — profile analysis, career recommendation, skill gap analysis, learning roadmap, certification recommendation, and interview question generation — into one professional career report.

---

## 1. Tech Stack

- **Frontend:** HTML, CSS, JavaScript (vanilla, in `/public`)
- **Backend:** Node.js, Express.js (MVC architecture)
- **AI:** Google Gemini API (`@google/generative-ai`)
- **Database:** MongoDB with Mongoose
- **Deployment:** Render 

## 2. Folder Structure

```
career-guidance-agent/
├── config/           # Database connection
├── controllers/       # Route handler logic
├── routes/            # Express routers
├── models/            # Mongoose schemas (User, CareerReport)
├── services/          # geminiService.js, careerAgentService.js (the AI agent)
├── prompts/           # Reusable, structured Gemini prompts
├── middleware/         # Validation + error handling
├── utils/             # asyncHandler helper
├── public/            # Frontend: HTML, CSS, JS
├── server.js
├── package.json
├── .env.example
└── .gitignore
```

## 3. Prerequisites

- Node.js v18+ installed
- **MongoDB Compass** installed with a local MongoDB server running (or a MongoDB Atlas account for deployment)
- A Google Gemini API key from https://aistudio.google.com/app/apikey

## 4. Local Setup

### Step 1 — Install dependencies

```bash
cd career-guidance-agent
npm install
```

### Step 2 — Configure environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then edit `.env`:

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/career_guidance_agent
GEMINI_API_KEY=your_actual_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
```

### Step 3 — Connect using MongoDB Compass

1. Open **MongoDB Compass**.
2. Connect to `mongodb://localhost:27017` (default local connection).
3. Once the app runs and generates data, you'll see a new database named `career_guidance_agent` appear in Compass, containing two collections: `users` and `careerreports`.
4. You can inspect, filter, and manually edit documents directly from Compass while developing.

> If you don't have a local MongoDB server, install "MongoDB Community Server" alongside Compass, or point `MONGO_URI` to a free MongoDB Atlas cluster instead — Compass can connect to Atlas too.

### Step 4 — Run the server

```bash
npm start
```

Or, for auto-restart during development:

```bash
npm run dev
```

The app will be available at: `http://localhost:5000`

### Step 5 — Test it

1. Visit `http://localhost:5000` → Home page.
2. Click **Start Career Guidance** → fill in the form → submit.
3. You'll be redirected to a generated **Career Report** page.
4. Visit `http://localhost:5000/history.html` to see all previously generated reports.
5. Open MongoDB Compass and refresh the `career_guidance_agent` database to see the saved `users` and `careerreports` documents.

## 5. API Endpoints

| Method | Endpoint                    | Description                              |
|--------|------------------------------|-------------------------------------------|
| POST   | `/api/career/generate`       | Runs the AI agent, saves & returns a report |
| GET    | `/api/career/history`        | Returns all generated reports              |
| GET    | `/api/career/report/:id`     | Returns a single report by ID              |
| GET    | `/api/users/:email`          | Returns a user profile by email            |
| GET    | `/api/health`                | Health check                               |

## 6. Deployment on Render (No Docker)

### Step 1 — Push the project to GitHub

```bash
git init
git add .
git commit -m "Initial commit: AI Career Guidance Agent"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2 — Set up MongoDB Atlas (for production database)

Render cannot reach your local MongoDB Compass database, so for deployment:

1. Create a free cluster at https://www.mongodb.com/cloud/atlas.
2. Create a database user and allow network access from anywhere (`0.0.0.0/0`), or Render's IPs.
3. Get your connection string, e.g.:
   `mongodb+srv://<user>:<password>@cluster0.mongodb.net/career_guidance_agent`
4. You can still use **MongoDB Compass** to connect to this Atlas cluster locally for inspection — just paste the Atlas connection string into Compass's "New Connection" dialog.

### Step 3 — Create a new Web Service on Render

1. Go to https://dashboard.render.com → **New** → **Web Service**.
2. Connect your GitHub repository.
3. Configure:
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free (or paid, as needed)

### Step 4 — Add environment variables on Render

In the Render dashboard, under **Environment**, add:

```
PORT=10000
NODE_ENV=production
MONGO_URI=<your MongoDB Atlas connection string>
GEMINI_API_KEY=<your Gemini API key>
GEMINI_MODEL=gemini-1.5-flash
```

(Render automatically provides a `PORT` value at runtime; the app reads `process.env.PORT`, so this works out of the box.)

### Step 5 — Deploy

Click **Create Web Service**. Render will install dependencies, start the server, and give you a live URL such as:

```
https://ai-career-guidance-agent.onrender.com
```

### Step 6 — Verify

Visit the live URL, submit the career form, and confirm the report generates and saves correctly. Check MongoDB Atlas (via Compass or the Atlas web UI) to confirm documents are being created.

## 7. Notes

- All Gemini API calls are handled server-side in `services/geminiService.js` — the API key is never exposed to the frontend.
- The AI Agent logic (module orchestration) lives in `services/careerAgentService.js`.
- Prompts are modular and stored in `/prompts` for easy tuning without touching business logic.
- Input validation happens both client-side (`public/js/form.js`) and server-side (`middleware/validateInput.js`).




