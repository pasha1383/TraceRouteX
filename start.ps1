#!/usr/bin/env pwsh
# Startup script for TraceRouteX - runs both backend and frontend

Write-Host "Starting TraceRouteX..." -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exist
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing root dependencies..." -ForegroundColor Yellow
    npm install
}

if (-not (Test-Path "backend/node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    npm --prefix backend install
}

if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm --prefix frontend install
}

Write-Host ""
Write-Host "Starting both backend and frontend servers..." -ForegroundColor Green
Write-Host "Backend will run on: http://localhost:3001" -ForegroundColor Blue
Write-Host "Frontend will run on: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host ""

# Run both servers concurrently
npm run dev
