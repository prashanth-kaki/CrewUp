# CrewUp

CrewUp is a modern, real-time team collaboration web application designed to help university students and professionals build teams, manage projects, and communicate seamlessly in a single unified workspace.

## 🚀 Features
- **Project Workspaces**: Dedicated file management and tracking per team.
- **Real-time Chat**: Fully integrated Socket.IO live communication mapped securely to team channels.
- **Matching Engine**: Intelligent matching to align skills (like React, AWS) with project requirements.
- **Responsive UI**: A beautiful, minimalist, light-themed interface built using Figma guidelines.

## 🛠 Tech Stack
- **Frontend**: React.js, Vite, Context API, CSS Variables, Socket.io-client
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Socket.io, JWT Authentication
- **Cloud**: AWS S3 integration via `multer-s3` for robust remote file handling

## 📂 Project Structure

This is a monorepo consisting of two separated environments to ensure modularity:

- **`/frontend`**: Contains the React application. Run `npm install` and `npm run dev` here to start the client.
- **`/backend`**: Contains the Node.js API and Database Models. Run `npm install` and `npm run dev` here to start the server.

> Note: Ensure your `.env` variables are correctly configured in the backend referencing your MongoDB URI and AWS keys before booting the node instance.
