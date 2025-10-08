# Google Sheets Dashboard

A React dashboard for interacting with the Google Sheets REST API.

## Features

- View spreadsheet metadata
- Browse all sheets and their data
- Detailed sheet information
- Responsive design

## Tech Stack

- React 18 with TypeScript
- Vite for fast development
- React Router for navigation
- Axios for API requests

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` to set your backend URL

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to http://localhost:5178 (or the next available port)

## Environment Variables

The frontend uses the following environment variables:

```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:3000
```

For production deployments:
- Netlify: Set in Netlify Dashboard → Site settings → Environment variables
- `VITE_BACKEND_URL=https://google-sheets-rest-api-production.up.railway.app`

## Building for Production

1. Build the application:
   ```bash
   npm run build
   ```

2. This will create a `dist` folder with all the optimized files

## Running in Production

For local testing:

```bash
# Build and preview the production build
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── config/         # Configuration files
├── pages/          # Page components
├── services/       # API service layer
├── types/          # TypeScript interfaces
├── App.tsx         # Main app component
└── main.tsx        # Entry point
```

## Deployment

### Netlify Deployment (Recommended - Easiest)

Netlify is the simplest option for deploying this static React application:

1. Push your code to GitHub
2. Visit [netlify.com](https://netlify.com) and sign in
3. Click "Add new site" → "Import an existing project"
4. Select your GitHub repository
5. Set these build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variable in Netlify Dashboard:
   - `VITE_BACKEND_URL=https://google-sheets-rest-api-production.up.railway.app`
7. Click "Deploy site"

### Manual Netlify Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build your project
npm run build

# Deploy to Netlify
netlify deploy --prod
```

### Railway Deployment (Alternative)

If you prefer Railway:

1. Push your code to GitHub
2. Create a new project in Railway
3. Connect your GitHub repository
4. Set the root directory to `/frontend` in Railway settings
5. Set environment variables in Railway dashboard:
   - `VITE_BACKEND_URL=https://google-sheets-rest-api-production.up.railway.app`
6. Railway will automatically:
   - Detect the Vite project
   - Run `npm run build` to build the application
   - Serve the static files automatically

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Note About server.js

The `server.js` file is provided for local testing but is not needed when deploying to Netlify or Railway,
which handle static file serving automatically for Vite applications.