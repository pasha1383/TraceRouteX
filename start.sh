#!/bin/bash
# Startup script for TraceRouteX - runs both backend and frontend

echo -e "\033[36mStarting TraceRouteX...\033[0m"
echo ""

# Check if node_modules exist
if [ ! -d "node_modules" ]; then
    echo -e "\033[33mInstalling root dependencies...\033[0m"
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo -e "\033[33mInstalling backend dependencies...\033[0m"
    npm --prefix backend install
fi

if [ ! -d "frontend/node_modules" ]; then
    echo -e "\033[33mInstalling frontend dependencies...\033[0m"
    npm --prefix frontend install
fi

echo ""
echo -e "\033[32mStarting both backend and frontend servers...\033[0m"
echo -e "\033[34mBackend will run on: http://localhost:3001\033[0m"
echo -e "\033[32mFrontend will run on: http://localhost:3000\033[0m"
echo ""
echo -e "\033[33mPress Ctrl+C to stop both servers\033[0m"
echo ""

# Run both servers concurrently
npm run dev
