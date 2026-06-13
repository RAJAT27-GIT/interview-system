# AI-Powered Multi-Round Interview System

![AI Interview System](https://img.shields.io/badge/AI-Interview%20System-blueviolet) ![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue) ![FastAPI](https://img.shields.io/badge/Backend-FastAPI-green)

An **Autonomous AI Interviewer** capable of analyzing resumes, generating tailored technical questions, and challenging candidates based on their specific skill sets. By leveraging modern Artificial Intelligence techniques (Llama 3.3 and Whisper AI), the system does not merely ask questions but performs a deep semantic analysis of candidate responses to provide accurate assessments.

## 🚀 Features

- **Resume Parsing & ATS Scoring**: Extracts skills and contact information using NLP (`pdfplumber` & `SpaCy`).
- **Dynamic Multi-Round Interviews**: Scales based on difficulty (3, 4, or 5 rounds) using the Llama 3.3 model.
- **Voice Integration**: Realistic interview experience with Groq Whisper API for Speech-to-Text (STT) and Google gTTS for Text-to-Speech (TTS).
- **Integrated Code Evaluator**: Built-in compiler environment supporting Python and JavaScript with real-time test case validation.
- **Proctoring System**: Tab-switching detection mechanism that auto-submits after multiple violations.
- **Admin Dashboard**: Comprehensive view for administrators to manage users, evaluate candidate performances, and manage question banks.
- **Personalized Feedback**: AI-generated advice based on final performance scores.

---

## 🛠️ Technology Stack

### Frontend
- **React.js (Vite)**
- **Tailwind CSS** (Premium styling and responsiveness)
- **Framer Motion** (Smooth animations)
- **Context API** (Global state management)

### Backend
- **Python (FastAPI)**
- **MongoDB** (NoSQL database for logs, questions, users)
- **Groq API** (Llama 3.3 model inference)
- **Whisper API** (Speech-to-Text)
- **gTTS** (Text-to-Speech synthesis)

---

## ⚙️ Prerequisites

Make sure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Python](https://www.python.org/) (v3.9 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)
- Git

---

## 💻 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd interview-system
```

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and configure environment variables.

```bash
cd backend

# (Optional but recommended) Create and activate a virtual environment
python -m venv myenv
# Windows:
myenv\Scripts\activate
# Mac/Linux:
source myenv/bin/activate

# Install requirements
pip install -r requirement.txt
```

Create a `.env` file inside the `backend` directory with the following variables:
```env
ADMIN_SECRET=your_admin_secret
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
MONGO_URI=your_mongodb_connection_string # Optional, depending on your database.py configuration
```

Start the FastAPI server:
```bash
uvicorn main:app --reload
```
The backend will run on `http://https://interview-system-1.onrender.com:8000`.

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, install dependencies, and start the development server.

```bash
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
The frontend will run on `http://https://interview-system-1.onrender.com:5173`.

---

## 📁 Project Structure

```text
interview-system/
├── backend/                  # FastAPI Python Backend
│   ├── app/                  # Core application logic, routers, and DB models
│   ├── main.py               # FastAPI application entry point
│   ├── requirement.txt       # Python dependencies
│   └── .env                  # Backend environment variables
├── frontend/                 # Vite + React Frontend
│   ├── src/                  # React components, pages, and context
│   ├── package.json          # Node.js dependencies
│   └── tailwind.config.js    # Tailwind CSS configuration
├── PROJECT_DOCUMENTATION.md  # Detailed technical theory and working
└── README.md                 # This file
```

---

## 🔗 Key API Endpoints

- **`POST /parse_resume`**: Analyzes PDF resumes and returns extracted skills and ATS scores.
- **`POST /start_interview`**: Generates a complete interview session structure based on the candidate profile.
- **`POST /evaluate_code`**: Executes user code safely in a sandbox and returns validation results against test cases.
- **`POST /feedback`**: Provides AI-generated personalized advice based on the final performance score.

---

## 🔮 Future Scope

- Integration of Eye-tracking proctoring via webcam.
- Emotional and confidence analysis using computer vision.
- Support for multiple natural languages (Multi-lingual AI).
- Automated shortlisting notifications for recruiters.

---

## 👥 Team

- **Prashant Kashyap** (Roll No: 2200650100070)
- **Prashant Pal** (Roll No: 2200650100074)
- **Rajaat Chadda** (Roll No: 2200650100084)
- **Ritik Chaudhary** (Roll No: 2200650100087)

*Developed for the 2025-2026 Session, Computer Science & Engineering Department.*
