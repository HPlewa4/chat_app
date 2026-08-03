# chatApp

> A bilingual, full-stack direct messaging app for finding people, keeping conversations organized, and personalizing every chat.

chatApp is a responsive one-to-one messaging application built with React, TypeScript, FastAPI, and MongoDB. Users can create an account, discover other users, exchange persistent text messages, upload a profile picture, and customize the colors of individual conversations. The interface is available in English and Polish.

## Features

- Account registration and login with bcrypt password hashing
- Username search and one-to-one conversation creation
- Persistent messages and recent-chat previews stored in MongoDB
- Automatic message and conversation refresh every three seconds
- Profile picture uploads
- Per-conversation background and message color themes
- English and Polish interface translations
- Responsive dark-themed interface

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, TypeScript, React Router, Axios, i18next, Lucide React |
| Backend | FastAPI, Motor, Pydantic, bcrypt |
| Database | MongoDB |

## Project structure

```text
chat_app/
├── backend/
│   ├── app/
│   │   ├── models/       # Request and response models
│   │   ├── routes/       # User and chat API endpoints
│   │   ├── auth.py       # Password hashing and verification
│   │   ├── database.py   # MongoDB connection and collections
│   │   └── main.py       # FastAPI application
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── Components/   # Authentication, chat, and settings UI
│   │   ├── locales/      # English and Polish translations
│   │   ├── api.ts        # API client configuration
│   │   └── App.tsx       # Routes and application state
│   └── package.json
├── brun.sh               # Backend development launcher
└── frrun.sh              # Frontend development launcher
```

## Prerequisites

- Python 3.10 or newer
- Node.js 18 or newer and npm
- A running MongoDB instance

## Getting started

### 1. Configure the backend

From the repository root, create a virtual environment and install the Python dependencies:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create `backend/app/.env` with your MongoDB connection string:

```dotenv
MONGO_URL=mongodb://localhost:27017
```

The backend uses the `mydatabase` database and creates the `users`, `messages`, and `sessions` collections as they are needed.

Start the API from the `backend` directory:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`, with interactive documentation at `http://localhost:8000/docs`.

### 2. Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:3000`. The frontend is currently configured to call the API at `http://localhost:8000` in `frontend/src/api.ts`.

## Available scripts

From `frontend/`:

```bash
npm start       # Run the development server
npm run build   # Create a production build
npm test        # Run the test watcher
```

From the repository root, `./brun.sh` and `./frrun.sh` can also start the backend and frontend. The backend script expects its virtual environment at `backend/.venv`.

## API overview

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/users/register` | Create an account |
| `POST` | `/users/login` | Log in with email and password |
| `GET` | `/users/search` | Find users by username |
| `POST` | `/users/avatar` | Upload a profile picture |
| `POST` | `/chat/session` | Find or create a direct conversation |
| `GET` | `/chat/sessions` | List a user's recent conversations |
| `POST` | `/chat/message` | Send a message |
| `GET` | `/chat/messages` | List messages in a conversation |
| `GET` | `/chat/session/{id}/theme` | Get a conversation theme |
| `PUT` | `/chat/session/{id}/theme` | Save a conversation theme |

## Current limitations

- Updates use three-second polling rather than WebSockets.
- Authentication state is stored in the browser; the API does not currently issue tokens or protect chat endpoints.
- Conversations are one-to-one only.
- Uploaded avatars are stored on the backend's local filesystem.

## License

No license has been added yet.
