# PrepAI — Frontend

> React frontend for PrepAI, an AI-powered placement preparation platform. Built with React, Vite, and React Router.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 + Vite | UI framework and build tool |
| React Router v6 | Client-side routing |
| Axios | HTTP client with JWT interceptors |
| Context API | Global authentication state |
| Web Speech API | Voice input and text-to-speech |

## Features

- **Landing page** — Public marketing page with feature showcase
- **Authentication** — Register and login with JWT token management
- **Mock Interview** — 4-phase interview flow with voice support
- **Skill Gap Analyser** — Resume upload, job description comparison, roadmap display
- **Study Assistant** — PDF upload, semantic search, chat interface
- **Dashboard** — Interview history, quick actions, progress overview
- **Profile** — Statistics, score trends, company-wise breakdown

## Project Structure
src/
├── api/
│   └── axios.js          # Axios instance with JWT interceptor
├── context/
│   └── AuthContext.jsx   # Global auth state with localStorage persistence
├── components/
│   └── Navbar.jsx        # Authenticated navigation bar
├── pages/
│   ├── Landing.jsx       # Public landing page
│   ├── Login.jsx         # Login form
│   ├── Register.jsx      # Registration form
│   ├── Dashboard.jsx     # Main dashboard after login
│   ├── Interview.jsx     # Mock interview (setup → question → feedback → results)
│   ├── SkillGap.jsx      # Resume and JD analyser
│   ├── ChatBot.jsx       # RAG study assistant
│   └── Profile.jsx       # User profile and history
└── App.jsx               # Route definitions with protected routes

## How Authentication Works
User logs in → backend returns JWT token
Token stored in localStorage via AuthContext
Axios interceptor attaches token to every request automatically
ProtectedRoute component checks token before rendering any page
Token expiry (7 days) → user redirected to login

## Local Setup

```bash
# Clone the repository
git clone https://github.com/manasa-3066/prepai-frontend.git
cd prepai-frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev
```

Open `http://localhost:5173`

## Environment Variables

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Key Technical Decisions

**Why Vite over Create React App?**
Vite starts in under 1 second vs 30+ seconds for CRA. Hot module replacement is instant. CRA is no longer maintained by Meta.

**Why Context API over Redux?**
PrepAI only needs global auth state — user info and token. Redux adds significant boilerplate for this simple use case. Context API with useReducer is sufficient and keeps the codebase clean.

**Why inline styles over CSS files?**
Co-locating styles with components makes them self-contained and portable. No class name conflicts, no global CSS side effects.

**Why Web Speech API over a library?**
The browser's built-in Speech Recognition and Speech Synthesis APIs are sufficient for PrepAI's voice features with zero bundle size cost.

## Author

**Manasa Kalavakolanu**
- GitHub: [@manasa-3066](https://github.com/manasa-3066)