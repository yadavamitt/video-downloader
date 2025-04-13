#!/bin/bash

# Kill previously running processes on port 8000 (backend) and 5173 (vite)
fuser -k 8000/tcp 2>/dev/null
fuser -k 5173/tcp 2>/dev/null

# Run backend
echo "🚀 Starting FastAPI backend on port 8000..."
cd backend
source venv/bin/activate
uvicorn app.main:app --reload &
BACKEND_PID=$!
cd ..

# Run frontend
echo "🎨 Starting React frontend on port 5173..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Trap Ctrl+C and clean up
trap "echo '🛑 Shutting down...'; kill $BACKEND_PID $FRONTEND_PID; exit;" INT

# Keep script running
wait
