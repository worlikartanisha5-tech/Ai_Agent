# 🤖 AI Agent — Your Personal AI Assistant

A general-purpose AI assistant built with React, FastAPI, Python, and Ollama. Submit tasks to the AI, get responses, and analyze text or PDF documents through a simple web interface.

## ✨ Features

- **AI Task Assistant:** Submit tasks and receive AI-generated responses.
- **Document Analysis:** Upload PDF or TXT files and ask questions about their contents.
- **Local AI Processing:** Uses Ollama with the `llama3.2` model.
- **Interactive Web Interface:** A React-based frontend for interacting with the assistant.
- **FastAPI Backend:** Handles requests between the frontend and AI model.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React + Vite | Frontend |
| Python | Backend programming |
| FastAPI | API development |
| Ollama | Local AI model |
| Llama 3.2 | Language model |

## 📁 Project Structure

```text
Ai_Agent/
├── backend/
│   └── main.py
├── frontend/
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       └── main.jsx
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Python
- Node.js and npm
- Ollama installed with the `llama3.2` model

### 1. Start the backend

Open PowerShell in the project folder:

```powershell
cd backend
..\venv\Scripts\Activate.ps1
python -m uvicorn main:app --reload
```

Backend API: `http://127.0.0.1:8000`

API documentation: `http://127.0.0.1:8000/docs`

### 2. Start the frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL shown in your terminal, usually `http://localhost:5173`.

### 3. Run the AI model

Make sure Ollama is installed, the `llama3.2` model is available, and the Ollama service is running.

## 🔮 Future Improvements

- Conversation history
- Improved document question answering
- User-customizable AI settings
- More productivity-focused features
- Enhanced error handling and user experience

## 👩‍💻 Project

**AI Agent** — a learning project exploring local language models, API development, and modern frontend development.

Built with curiosity and a passion for AI.
