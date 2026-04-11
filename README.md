# CrewUp

CrewUp is a collaborative networking platform designed to connect individuals based on their skills and project requirements. It maps the traditional "looking for a group" experience into a highly structured web environment, enabling students and professionals to instantiate teams, manage project files, and communicate in real-time.

---

## Core Concept
The core idea behind CrewUp is to eliminate the friction in finding the right collaborators. Whether entering a hackathon, starting a senior capstone project, or building a startup, users often struggle to find partners with the exact technical or creative skills required. CrewUp solves this by acting as a specialized matching engine: it analyzes a user's profile against open project demands, suggesting highly compatible opportunities.

## How It Works
The application follows a streamlined user flow moving from individual registration to team-based project management:

1. **User Sign Up**: Individuals create an authenticated profile detailing their specific skills (e.g., React, Python, Data Science) and general interests.
2. **Project Creation & Exploration**: Users can post new project opportunities detailing exactly what roles they need filled, or they can browse an explore feed of currently open teams.
3. **Matching Engine**: The system algorithmically suggests open projects to users based on an intersection between the user's declared skills and the project's missing roles.
4. **Collaboration Workspace**: Once a user joins a team, they gain access to a dedicated Team Workspace.
5. **Real-time Chat & Asset Management**: Inside the workspace, teams can utilize a persistent Socket.IO chat room for live updates and a centralized cloud-storage file repository to share and track project resources.

---

## Project Structure
CrewUp is architected as a monorepo containing two dedicated environments. 

### /backend
A standard Node.js/Express REST API heavily integrated with MongoDB (Mongoose) for schema validation. 
- Manages strict authentication using JSON Web Tokens (JWT).
- Hosts the Socket.IO server to orchestrate live chat rooms.
- Connects directly to AWS S3 buckets to handle cloud file staging and retrieval.

### /frontend
A React.js Single Page Application scaffolded with Vite. 
- Employs a robust Context API for global state management.
- Handles protected routing layouts to securely map authenticated users to their dashboards.
- Utilizes CSS variables and flexbox grids to maintain a clean, minimalist design standard.

---

## Setup Instructions

### Backend Configuration
Navigate to the `backend` directory. You will need to create a `.env` file containing the following variables:
- `MONGO_URI`: Your MongoDB connection string.
- `JWT_SECRET`: A cryptographic key for generating session tokens.
- `AWS_ACCESS_KEY_ID`: Your AWS IAM identifier.
- `AWS_SECRET_ACCESS_KEY`: Your AWS IAM secret password.
- `S3_BUCKET_NAME`: The target S3 bucket for file uploads.

Install dependencies and start the local development server:
```bash
cd backend
npm install
npm run dev
```

### Frontend Configuration
Navigate to the `frontend` directory. Ensure the backend server is actively running on port 5000, as the React UI targets `http://localhost:5000/api` for all data fetching.

Install dependencies and start the Vite client:
```bash
cd frontend
npm install
npm run dev
```
