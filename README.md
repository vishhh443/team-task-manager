# Team Task Manager

A full-stack project management application built with the MERN stack.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Lucide React, Axios, Framer Motion
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Ready for Railway

## Features
- **Role-Based Access**: Admins can manage projects and tasks; Members can view and update their tasks.
- **Project Management**: Create and track multiple projects.
- **Task Assignment**: Assign tasks to specific team members with due dates.
- **Status Tracking**: Move tasks through "To Do", "In Progress", and "Done".
- **Premium UI**: Modern, dark-themed interface with glassmorphism and smooth interactions.

## Setup Instructions

### 1. Prerequisites
- Node.js installed
- MongoDB (Local or Atlas)

### 2. Backend Setup
1. Navigate to the `backend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (or use the provided one) and update your `MONGO_URI` and `JWT_SECRET`.
4. Start the server:
   ```bash
   npm start
   ```

### 3. Frontend Setup
1. Navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Folder Structure
```
team-task-manager/
├── backend/
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── controllers/  # API logic
│   │   ├── middleware/   # Auth & role checks
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API endpoints
│   │   └── server.js     # Entry point
│   └── .env              # Environment variables
└── frontend/
    ├── src/
    │   ├── components/   # Reusable UI components
    │   ├── context/      # Auth state management
    │   ├── pages/        # Main application screens
    │   ├── services/     # API integration
    │   └── App.jsx       # Routing & main logic
    └── tailwind.config.js # Styling configuration
```

## Deployment
This project is ready for deployment on **Railway**.
- Connect your GitHub repository.
- Add environment variables (`MONGO_URI`, `JWT_SECRET`) in the Railway dashboard.
- Railway will automatically detect the `package.json` files and deploy.
