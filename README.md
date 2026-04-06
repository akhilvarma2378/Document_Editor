# AI-Native Collaborative Doc Editor

A lightweight, full-stack collaborative document editor built as a technical MVP. This application demonstrates core product engineering skills, focusing on robust backend architecture, rapid frontend development, and clean sharing logic without the overhead of complex infrastructure.

## 🛠 Tech Stack

**Backend**
* **Framework:** FastAPI (Python 3.12)
* **Database:** SQLite (via SQLAlchemy ORM)
* **Validation:** Pydantic V2

**Frontend**
* **Framework:** React (Bootstrapped with Vite)
* **Editor:** React-Quill
* **HTTP Client:** Axios

---

## 🚀 Local Setup Instructions

This project is designed to run locally with zero friction. You do not need to install Docker or set up an external database.

### Prerequisites
* Python 3.9+
* Node.js v18+ 

### 1. Start the Backend

Open a terminal and navigate to the backend directory:

```bash
cd doc-editor-backend
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install fastapi[all] sqlalchemy python-multipart pytest httpx

# Run the server
uvicorn main:app --reload
```
Note: The API will be running at http://127.0.0.1:8000. The application automatically creates a local app.db SQLite file and seeds it with two test users: Alice (ID: 1) and Bob (ID: 2).

2. Start the Frontend
Open a new terminal window and navigate to the frontend directory:

```Bash
cd frontend

#Install the Node modules and start the Vite development server
npm install
npm run dev
```
Note: The frontend will be available at http://localhost:5173. Select a user from the top dropdown to simulate logging in.
