# Frontend Deployment Guide

## Deploying to Railway

### Prerequisites
1. Railway account ([railway.app](https://railway.app))
2. GitHub repository with your frontend code
3. Backend API deployed and accessible

### Deployment Steps

1. **Prepare Your Repository**
   ```bash
   # Make sure all changes are committed
   git add .
   git commit -m "Prepare frontend for deployment"
   git push origin main
   ```

2. **Connect Railway to GitHub**
   - Log in to Railway
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Environment Variables**
   - In Railway dashboard, go to your project
   - Click on "Variables" tab
   - No specific environment variables are required for the frontend

4. **Set Build Configuration**
   Railway will automatically detect the Vite project and use the following configuration:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Start command: `npm start`

5. **Deploy**
   - Railway will automatically build and deploy your application
   - The build process will:
     1. Install dependencies with `npm install`
     2. Build the frontend with `npm run build`
     3. Start the server with `npm start`
   - Your app will be available at `https://your-app-name.up.railway.app`

### Custom Domain (Optional)
1. In your Railway project, go to "Settings"
2. Click "Custom Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

### Environment Variables
The frontend doesn't require any environment variables as it connects directly to your deployed API.

### Troubleshooting

#### Common Issues
1. **Build Failures**
   - Ensure all dependencies are properly listed in package.json
   - Check that the build command `npm run build` works locally
   - Verify that the start command `npm start` works locally

2. **Runtime Errors**
   - Check Railway logs for detailed error messages
   - Ensure the server.js file is correctly configured
   - Verify that all required dependencies are installed

3. **CORS Issues**
   - The server already includes CORS middleware
   - If you encounter CORS issues, verify your backend CORS configuration

#### Checking Logs
1. In Railway dashboard, go to your project
2. Click on your service
3. Click on "Logs" tab to view real-time logs

### Local Development vs Production
- **Development**: `npm run dev` (Vite development server)
- **Production**: `npm run build` + `npm start` (Static files served by Express)

### Updating Your Deployment
1. Make changes to your code
2. Commit and push to GitHub
3. Railway will automatically redeploy your application

### Health Check
The frontend includes a simple health check endpoint that returns a 200 status for all requests.

## Alternative Deployment Options

### Netlify
1. Sign in to Netlify
2. Click "New site from Git"
3. Connect your repository
4. Set the build command to `npm run build`
5. Set the publish directory to `dist`

### Vercel
1. Sign in to Vercel
2. Create a new project
3. Connect your Git repository
4. Vercel will automatically detect the Vite project
5. Set the output directory to `dist`