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

For Railway deployment, you can set this in the Railway dashboard:
- `VITE_BACKEND_URL=http://google-sheets-rest-api.railway.internal:3000` (for internal services)
- `VITE_BACKEND_URL=https://your-backend-url.railway.app` (for external services)

## Building for Production

1. Build the application:
   ```bash
   npm run build
   ```

2. This will create a `dist` folder with all the optimized files

## Running in Production

Railway will automatically detect and build this Vite application. For local testing:

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

### Railway Deployment (Recommended)

Railway automatically detects Vite applications and handles the build process:

1. Push your code to GitHub
2. Create a new project in Railway
3. Connect your GitHub repository
4. Set the root directory to `/frontend` in Railway settings
5. Set environment variables in Railway dashboard:
   - `VITE_BACKEND_URL=http://google-sheets-rest-api.railway.internal:3000` (if using internal services)
6. Railway will automatically:
   - Detect the Vite project
   - Run `npm run build` to build the application
   - Serve the static files automatically (no custom server needed)

### Environment Variables in Railway

In Railway Dashboard → Your Project → Variables:
```
VITE_BACKEND_URL=http://google-sheets-rest-api.railway.internal:3000
```

If your frontend and backend are in the same Railway project and the backend service is named `google-sheets-rest-api`, use the internal URL for better performance.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Note About server.js

The `server.js` file is provided for local testing but is not needed when deploying to Railway,
which handles static file serving automatically for Vite applications.