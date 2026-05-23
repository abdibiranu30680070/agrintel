#!/bin/bash

# AgriIntel Ethiopia - Start All Services
# This script starts the frontend, backend, and AI service simultaneously

echo "🌱 Starting AgriIntel Ethiopia Services..."
echo "=========================================="

# Kill any existing processes on the ports
echo "🧹 Cleaning up existing processes..."
fuser -k 5173/tcp 2>/dev/null || true
fuser -k 5000/tcp 2>/dev/null || true
fuser -k 8000/tcp 2>/dev/null || true

# Start AI Service
echo "🤖 Starting AI Service (port 8000)..."
cd ai-service
python main.py &
AI_PID=$!
cd ..

# Wait a moment for AI service to start
sleep 3

# Start Backend Service
echo "🔧 Starting Backend Service (port 5000)..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start Frontend
echo "🎨 Starting Frontend (port 5173)..."
cd frontend-web
npm run dev &
FRONTEND_PID=$!
cd ..

echo "=========================================="
echo "✅ All services started successfully!"
echo "=========================================="
echo "🤖 AI Service:    http://localhost:8000"
echo "🔧 Backend API:   http://localhost:5000"
echo "🎨 Frontend:      http://localhost:5173"
echo "=========================================="
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Function to kill all processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    kill $AI_PID 2>/dev/null || true
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    echo "✅ All services stopped"
    exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup SIGINT SIGTERM

# Wait for all background processes
wait
