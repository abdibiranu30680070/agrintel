#!/bin/bash

# AgriIntel Ethiopia - Stop All Services
# This script stops the frontend, backend, and AI service

echo "🛑 Stopping AgriIntel Ethiopia Services..."
echo "=========================================="

# Kill processes on the ports
echo "🤖 Stopping AI Service (port 8000)..."
fuser -k 8000/tcp 2>/dev/null || true

echo "🔧 Stopping Backend Service (port 5000)..."
fuser -k 5000/tcp 2>/dev/null || true

echo "🎨 Stopping Frontend (port 5173)..."
fuser -k 5173/tcp 2>/dev/null || true

echo "=========================================="
echo "✅ All services stopped"
echo "=========================================="
