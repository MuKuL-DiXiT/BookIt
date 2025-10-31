# BookIt

A full-stack booking application (frontend + backend). This repository contains two main parts:
- `frontend` — the web user interface (Next.js)
- `backend` — the server (Node.js)

Live demo: https://book-it-rouge.vercel.app

## Table of Contents

- [Project overview](#project-overview)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
  - [Frontend (local)](#frontend-local)
  - [Backend (local)](#backend-local)
  - [Run both with one terminal (optional)](#run-both-with-one-terminal-optional)
- [Environment configuration](#environment-configuration)
- [Build and deployment](#build-and-deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Maintainership & contact](#maintainership--contact)

## Project overview

BookIt is a booking/reservation application that separates concerns into a frontend web application and a backend API. The frontend is intended to run in the browser and interact with the backend through HTTP/REST (or GraphQL, if present). This repository is organized to keep the client and server code in dedicated directories for clearer development workflows.

## Features

- Separate frontend and backend for focused development
- TypeScript across the codebase
- Deployed frontend (Vercel) at the provided homepage
- Typical features expected in a booking app: listings, booking creation, user authentication, booking management (actual features depend on implementation in each folder)

## Tech stack

- Language: TypeScript, JavaScript
- Frontend: Next.js, TypeScript, TailwindCSS
- Backend:  Node/Express, javaScript
- Deployment: vercel for frontend and render for backend

## Project structure

Top-level:
- backend/ — server code and API
- frontend/ — web UI code

Open these folders for their own README and package scripts. Each should contain its own package.json and instructions for installation and running.

## Prerequisites

- Node.js (recommend v18+)
- npm, yarn, or pnpm
- A database if the backend requires one (Postgres, MongoDB, etc.) — check backend docs/config
- Git for cloning

## Quick start

These are generic steps that will work for typical TypeScript Node + React/Next projects. Check `frontend/package.json` and `backend/package.json` for exact scripts and adjust commands accordingly.

1. Clone the repo
   ```
   git clone https://github.com/MuKuL-DiXiT/BookIt.git
   cd BookIt
   ```

2. Install dependencies

Frontend:
```
cd frontend
npm install
```

Backend:
```
cd ../backend
npm install
```

### Frontend (local)

Start the frontend in development mode:
```
cd frontend
npm run dev
```
Open http://localhost:3000 (or the port shown by the framework).

### Backend (local)

Start the backend in development mode:
```
cd backend
npm start
```
The backend will typically run on http://localhost:8000 or the port configured in environment variables.

### Run both with one terminal (optional)

From repository root, you can use a terminal multiplexer (tmux) or tools like `concurrently` or `pnpm -w` if included. Example (if `concurrently` is installed):
```
npx concurrently "cd backend && npm run dev" "cd frontend && npm run dev"
```

## Environment configuration

Create `.env` files in both `frontend` and `backend` as required. Typical variables you may need to configure:

Backend:
- PORT=8000
- DATABASE_URL=mongoDB_string(create one if you want to
- JWT_SECRET=your_jwt_secret
- NODE_ENV=development

Frontend:
- NEXT_PUBLIC_API_URL=http://localhost:3000
- NODE_ENV=development

Adjust names and values to match the code in each folder. If the backend uses a `.env.example` or other config file, follow that as the source of truth.

## Build and deployment

- Frontend: run `npm run build` inside `frontend` then `npm start` (or follow framework-specific deployment instructions). Frontend appears to be deployed to Vercel (see homepage).
- Backend: run `npm run build` then start the compiled server (`npm start`) or use a process manager (PM2) or containerization (Docker) for production.

If you plan to deploy:
- Frontend: Vercel (recommended for static/Next.js)
- Backend: cloud provider (Heroku, Railway, Render, AWS, GCP) or container platform with environment variables configured

## Testing

Check for test scripts in each package.json:
```
# example
cd frontend
npm test

cd ../backend
npm test
```
If no tests are present, consider adding unit and integration tests for critical components.
