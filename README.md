# Student Attendance and Performance Tracker

A full-stack MERN application for managing student attendance, tracking academic performance, and generating reports.

## Features

- **Tabbed Interface**: Easy navigation between Home, Attendance, Performance, Login Attendance, and Admin sections.
- **Student Management**: Add, update, and delete student records.
- **Attendance Tracking**: 
  - Mark daily attendance (Present/Absent).
  - Bulk attendance marking for all students.
  - Visual progress bars for attendance percentage.
- **Performance Tracking**: 
  - Record subject-wise marks.
  - Auto-calculate grades and percentages.
- **Reports**: Generate downloadable PDF reports for individual students.

## Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB

## Prerequisites

- Node.js installed
- MongoDB installed or a MongoDB Atlas connection string

## Setup Instructions

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the `backend` directory with your MongoDB URI:
```env
MONGO_URI=your_mongodb_connection_string
PORT=3001
```

Start the backend server:
```bash
npm run dev
```
The server will run on `http://localhost:3001`.

### 2. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```
The application will run on `http://localhost:5173`.

## Usage

1. Open the app in your browser.
2. Go to the **Admin** tab to add students.
3. Use the **Login Attendance** tab to mark daily attendance.
4. View stats in the **Attendance** and **Performance** tabs.
5. Click "Report" on a student card (Home tab) or list to download a summary.
