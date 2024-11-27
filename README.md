
Frontend and Backend Setup


Frontend Setup
--------------

Prerequisites:
1. Node.js installed on your machine.
2. A code editor (e.g., VS Code).

Steps to Run Frontend:

1. Navigate to the Frontend Directory
   Open your terminal and run:
   cd path/to/frontend

2. Install Dependencies
   Run the following command to install the required packages:
   npm install

3. Start the Development Server
   Launch the frontend by running:
   npm start
   This will start the development server, and you can access the application in your browser at:
   http://localhost:3000

4. Build for Production (Optional)
   To create a production-ready build:
   npm run build

Frontend Commands Summary:
--------------------------
- `npm install`: Install all dependencies.
- `npm start`: Run the application in development mode.
- `npm run build`: Build the app for production.

Backend Setup
-------------

Prerequisites:
1. Python installed on your machine.
2. A virtual environment tool (e.g., `venv`).
3. SQLite (or any configured database).

Steps to Run Backend:

1. Navigate to the Backend Directory
   Open your terminal and run:
   cd path/to/backend

2. Create a Virtual Environment
   Set up a virtual environment to isolate the backend dependencies:
   python -m venv venv

3. Activate the Virtual Environment
   - For Windows:
     venv\\Scripts\\activate
   - For Mac/Linux:
     source venv/bin/activate

4. Install Dependencies
   Install all required Python packages:
   pip install -r requirements.txt

5. Set Up the Database
   Initialize the database by running:
   python -m backend.database

6. Start the Backend Server
   Use Uvicorn to start the FastAPI server:
   uvicorn backend.main:app --reload
   The backend server will be accessible at:
   http://127.0.0.1:8000

7. Testing API Endpoints (Optional)
   Open your browser or use tools like Postman to test API endpoints. For API documentation, visit:
   http://127.0.0.1:8000/docs

Backend Commands Summary:
-------------------------
- `python -m venv venv`: Create a virtual environment.
- `venv\\Scripts\\activate`: Activate virtual environment (Windows).
- `source venv/bin/activate`: Activate virtual environment (Mac/Linux).
- `pip install -r requirements.txt`: Install all backend dependencies.
- `python -m backend.database`: Set up and initialize the database.
- `uvicorn backend.main:app --reload`: Start the development server.

Full Workflow Summary
---------------------

1. Frontend:
   cd path/to/frontend
   npm install
   npm start

2. Backend:
   cd path/to/backend
   python -m venv venv
   venv\\Scripts\\activate   # For Windows
   # OR
   source venv/bin/activate  # For Mac/Linux
   pip install -r requirements.txt
   python -m backend.database
   uvicorn backend.main:app --reload

Notes:
------
- **Frontend URL:** http://localhost:3000
- **Backend URL:** http://127.0.0.1:8000
- Test API endpoints using `/docs` on the backend URL.
