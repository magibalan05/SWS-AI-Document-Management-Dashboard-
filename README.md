# Document Management Dashboard

A full-stack document management app built with Node.js, Express, MongoDB, and vanilla JS.

## Tech Stack
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **File Upload**: Multer

## Setup & Run

### 1. Install MongoDB
Download from: https://www.mongodb.com/try/download/community  
Start the service before running the backend.

### 2. Install backend dependencies
```bash
cd backend
npm install
```

### 3. Start the backend
```bash
npm run dev
```
Server runs on http://localhost:5000

### 4. Open the frontend
Open `frontend/index.html` in your browser.

## Auto GitHub Push (every 15 minutes)

Run the script from the project root:
```bash
chmod +x auto-push.sh
./auto-push.sh
```

## Project Structure
```
document-dashboard/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── uploads/
│   ├── models/
│   │   ├── Document.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── uploadRoutes.js
│   │   └── notificationRoutes.js
│   └── config/
│       └── db.js
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js
```
