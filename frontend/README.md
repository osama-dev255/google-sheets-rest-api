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

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to http://localhost:5178 (or the next available port)

## Building for Production

1. Build the application:
   ```bash
   npm run build
   ```

2. This will create a `dist` folder with all the optimized files

## Running in Production

1. After building, start the production server:
   ```bash
   npm start
   ```

2. The server will start on port 3000 (or the PORT environment variable)

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

### Railway Deployment

1. Push your code to a GitHub repository
2. Create a new project in Railway
3. Connect your GitHub repository
4. Railway will automatically detect the Vite project and deploy it
5. Set the start command to `npm start` in Railway settings

### Docker Deployment

You can also deploy using Docker:

```bash
# Build the Docker image
docker build -t google-sheets-dashboard .

# Run the container
docker run -p 3000:3000 google-sheets-dashboard
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

The frontend connects to your deployed backend API at:
`https://google-sheets-rest-api-production.up.railway.app`

If you need to change this, update the API configuration in `src/config/api.ts`.