# Task Controller App

The **Task Controller App** is a powerful and intuitive application designed to help users manage their tasks and subtasks effectively. With features like filtering, sorting, and the ability to create, edit, and delete tasks, this app provides everything you need to stay organized and productive.

---

## Features

- **Task Management**:
  - Create, edit, delete, complete, and uncomplete tasks and subtasks.
- **Filtering Options**:
  - Filter tasks by name, description, or date.
- **Sorting Options**:
  - Sort tasks by date, priority, or alphabetically (ascending or descending order).
- **Custom Views**:
  - Show/hide completed tasks.
  - Show/hide overdue tasks.
  - Show/hide task descriptions and priorities.
- **User Authentication**:
  - Sign up and log in with Firebase authentication.
  - Change email or password securely.
  - Logout and delete account functionality.
- **Responsive Navigation**:
  - Built with **React Router** for smooth navigation between views.

---

## Tech Stack

- **Frontend**: React.js
- **Routing**: React Router
- **Authentication**: Firebase Authentication
- **Backend Communication**: GraphQL queries to a separate backend server

---

## Live Demo

A hosted version of the app is available at the following link: 
Note: The app may take up to 30 seconds to respond to a request if it has been inactive for more than 15 minutes. This delay is due to the backend being hosted on Render’s free tier, which incurs a server cold start when inactive for more than 15 minutes.
**[Live App Link](#)** _(Add your hosted link here)_

---

## Note

To spin up this app locally, you will need the following valid Firebase fields in a `.env` file in the root of the project 

REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-firebase-app-id

You will need to obtain these credentials from your Firebase account under Project Settings in the Firebase Console.

Yout will also need the following field in the `.env` to properly connect with the backend 

backendUrl='https://task-controller-backend.onrender.com/graphql'

Without these fields, the app cannot connect to Firebase for authentication.

## How to Run Locally

1. Clone the repository:
   git clone https://github.com/your-repo/task-controller-frontend.git

2. Add a .env file to the root of the project with the following Firebase fields:
   REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-firebase-app-id
   backendUrl='https://task-controller-backend.onrender.com/graphql'

   Note: Without these fields, the app cannot connect to Firebase for authentication or the backend.

4. Navigate to the project directory:
   cd task-controller-frontend

5. Clone the repository:
   npm install

6. Clone the repository:
   npm start

## Backend

The app requires a separate backend server to function. The backend handles all GraphQL queries and mutations. Refer to the backend repository for more details.

[Backend Repository Link](https://github.com/jorgeromero5055/task-controller-backend)
