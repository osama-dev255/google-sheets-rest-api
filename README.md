# Google Sheets REST API

A robust TypeScript-based REST API for interacting with Google Sheets using service account authentication. Built with Express.js and designed for deployment on Railway.

## 🚀 Features

- **Google Sheets Integration**: Read, write, update, and clear data from Google Sheets
- **Service Account Authentication**: Secure access using Google Cloud service account
- **RESTful API**: Clean and intuitive REST endpoints
- **TypeScript**: Full type safety and modern JavaScript features
- **Comprehensive Logging**: Winston-based logging with file rotation
- **Security**: Helmet, CORS, and rate limiting middleware
- **Error Handling**: Centralized error handling with detailed logging
- **Railway Ready**: Pre-configured for Railway cloud deployment
- **Health Checks**: Built-in health monitoring endpoints

## 📋 Prerequisites

Before running this application, you need:

1. **Node.js** (version 18 or higher)
2. **Google Cloud Project** with Sheets API enabled
3. **Google Service Account** with appropriate permissions
4. **Google Spreadsheet** that the service account can access

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repository-url>
cd railway-cloud-host
npm install
```

### 2. Google Cloud Setup

1. **Create a Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google Sheets API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Sheets API" and enable it

3. **Create Service Account**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Fill in the service account details
   - Download the JSON key file

4. **Share Your Spreadsheet**:
   - Open your Google Spreadsheet
   - Click "Share" and add your service account email
   - Give it "Editor" permissions

### 3. Environment Configuration

1. **Copy the example environment file**:
   ```bash
   copy .env.example .env
   ```

2. **Fill in your environment variables**:
   ```env
   NODE_ENV=development
   PORT=3000
   
   # From your service account JSON file
   GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
   GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
   GOOGLE_SHEETS_PROJECT_ID=your-google-cloud-project-id
   
   # Your spreadsheet ID (from the URL)
   GOOGLE_SHEETS_SPREADSHEET_ID=your-google-spreadsheet-id
   
   # Optional security settings
   CORS_ORIGIN=*
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

### 4. Run the Application

**Development mode**:
```bash
npm run dev
```

**Production mode**:
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Base URL
- Development: `http://localhost:3000`
- Production: `https://your-railway-app.railway.app`

### Authentication
This API uses Google Service Account authentication. No additional authentication is required for the REST endpoints.

### Endpoints

#### Health Check
```http
GET /health
```
Returns server health status and uptime information.

#### Root Information
```http
GET /
```
Returns API information and available endpoints.

#### Spreadsheet Metadata
```http
GET /api/v1/sheets/metadata
```
Returns spreadsheet metadata including all sheet names and properties.

**Response Example**:
```json
{
  "success": true,
  "data": {
    "title": "My Spreadsheet",
    "sheets": [
      {
        "sheetId": 0,
        "title": "Sheet1",
        "index": 0,
        "sheetType": "GRID",
        "gridProperties": {
          "rowCount": 1000,
          "columnCount": 26
        }
      }
    ]
  },
  "message": "Spreadsheet metadata retrieved successfully",
  "timestamp": "2023-10-07T12:00:00.000Z"
}
```

#### Get All Sheets Data
```http
GET /api/v1/sheets/all
```
Returns data from all sheets in the spreadsheet.

#### Get Specific Sheet Data
```http
GET /api/v1/sheets/{sheetName}?range={range}&majorDimension={dimension}
```

**Parameters**:
- `sheetName` (path): Name of the sheet
- `range` (query, optional): Range in A1 notation (e.g., "A1:C10")
- `majorDimension` (query, optional): "ROWS" or "COLUMNS" (default: "ROWS")

**Example**:
```http
GET /api/v1/sheets/Sheet1?range=A1:C10&majorDimension=ROWS
```

#### Get Specific Range Data
```http
GET /api/v1/sheets/{sheetName}/range/{range}?majorDimension={dimension}
```

**Example**:
```http
GET /api/v1/sheets/Sheet1/range/A1:C10
```

#### Update Sheet Data
```http
PUT /api/v1/sheets/{sheetName}/range/{range}
```

**Body**:
```json
{
  "values": [
    ["Name", "Age", "City"],
    ["John", "30", "New York"],
    ["Jane", "25", "Los Angeles"]
  ],
  "valueInputOption": "USER_ENTERED"
}
```

**Parameters**:
- `valueInputOption`: "RAW" or "USER_ENTERED" (default: "USER_ENTERED")

#### Append Data to Sheet
```http
POST /api/v1/sheets/{sheetName}/append
```

**Body**:
```json
{
  "values": [
    ["Bob", "35", "Chicago"]
  ],
  "valueInputOption": "USER_ENTERED"
}
```

#### Clear Sheet Data
```http
DELETE /api/v1/sheets/{sheetName}/clear?range={range}
```

**Parameters**:
- `range` (query, optional): Range to clear. If not provided, clears entire sheet.

### Response Format

All API responses follow this format:

```json
{
  "success": boolean,
  "data": any,
  "message": string,
  "error": string,
  "timestamp": string
}
```

### Error Handling

The API returns appropriate HTTP status codes:

- `200`: Success
- `201`: Created (for append operations)
- `400`: Bad Request (invalid parameters)
- `404`: Not Found (route or resource not found)
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error

## 🚀 Railway Deployment

For detailed deployment instructions, see [BACKEND_DEPLOYMENT.md](BACKEND_DEPLOYMENT.md).

### Quick Deployment Steps

1. **Connect Railway to GitHub**:
   - Log in to Railway
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Set Environment Variables**:
   - In Railway dashboard, go to your project
   - Click on "Variables" tab
   - Add all required environment variables from your `.env` file

3. **Deploy**:
   - Railway will automatically build and deploy your application
   - The build process uses the provided `Dockerfile`
   - Your app will be available at `https://your-app-name.railway.app`

### Environment Variables for Railway

Set these variables in Railway dashboard:

```
NODE_ENV=production
PORT=3000
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_SHEETS_PROJECT_ID=your-project-id
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important**: Make sure to properly escape the private key with `\n` for newlines.

## 🌐 Railway Internal Services (Advanced)

For better performance and security, you can deploy both the frontend and backend in the same Railway project and use internal service discovery:

### Service Configuration
```
Railway Project
├── google-sheets-rest-api (backend)
│   ├── Service Name: google-sheets-rest-api
│   ├── Internal URL: google-sheets-rest-api.railway.internal:3000
│   └── Port: 3000
│
└── frontend (dashboard)
    ├── Root Directory: /frontend
    └── Internal communication with backend via service discovery
```

The frontend automatically detects when it's running in Railway and uses the internal service URL for better performance.

For complete deployment instructions for both frontend and backend, see [FULL_DEPLOYMENT_GUIDE.md](FULL_DEPLOYMENT_GUIDE.md).

## 🖥️ Frontend Dashboard

This repository also includes a React-based frontend dashboard for interacting with the Google Sheets API.

### Features
- Dashboard overview with health status
- Browse all sheets and their data
- View detailed spreadsheet metadata
- Responsive design for all devices

### Getting Started with Frontend

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

The frontend will be available at `http://localhost:5178` (or the next available port).

### Deployment
The frontend can be deployed to any platform:

#### Railway Deployment (Recommended)
1. Push your frontend code to a GitHub repository
2. Create a new project in Railway
3. Connect your GitHub repository
4. Railway will automatically:
   - Build your frontend with `npm run build`
   - Serve it using the Express server
   - Deploy to `https://your-frontend-app.up.railway.app`

#### Docker Deployment
```bash
# Build and run with Docker
docker build -t google-sheets-dashboard ./frontend
docker run -p 3000:3000 google-sheets-dashboard
```

#### Static Hosting (Netlify, Vercel, etc.)
- Build command: `npm run build`
- Publish directory: `dist`

See `frontend/FRONTEND_DEPLOYMENT.md` for detailed instructions.

## 🧪 Testing

Test your API using tools like:

- **Postman**
- **cURL**
- **Thunder Client** (VS Code extension)

### Example cURL Commands

```bash
# Health check
curl https://your-app.railway.app/health

# Get metadata
curl https://your-app.railway.app/api/v1/sheets/metadata

# Get sheet data
curl https://your-app.railway.app/api/v1/sheets/Sheet1

# Update data
curl -X PUT https://your-app.railway.app/api/v1/sheets/Sheet1/range/A1:B2 \
  -H "Content-Type: application/json" \
  -d '{"values":[["Name","Age"],["John","30"]]}'
```

## 🔒 Security Considerations

- **Service Account Keys**: Keep your service account JSON file secure
- **Environment Variables**: Never commit `.env` files to version control
- **CORS**: Configure appropriate CORS origins for production
- **Rate Limiting**: Adjust rate limits based on your needs
- **HTTPS**: Always use HTTPS in production (Railway provides this automatically)

## 📊 Logging

The application uses Winston for comprehensive logging:

- **Console Logs**: Colored output for development
- **File Logs**: Rotating daily log files in the `logs/` directory
- **Error Logs**: Separate error log files
- **HTTP Logs**: Request/response logging

Log levels: `error`, `warn`, `info`, `http`, `debug`

## 🛠️ Development

### Project Structure

```
src/
├── config/          # Configuration files
│   ├── environment.ts
│   └── logger.ts
├── middleware/      # Express middleware
│   └── index.ts
├── routes/          # API routes
│   └── sheets.ts
├── services/        # Business logic
│   └── googleSheetsService.ts
├── types/           # TypeScript type definitions
│   └── index.ts
├── utils/           # Utility functions
│   └── responseHelpers.ts
├── server.ts        # Express server setup
└── index.ts         # Application entry point
```

### Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build TypeScript to JavaScript
- `npm start`: Start production server
- `npm run clean`: Clean build directory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Troubleshooting

### Common Issues

1. **Authentication Errors**:
   - Verify service account email has access to the spreadsheet
   - Check that the private key is properly formatted with `\n` for newlines
   - Ensure Google Sheets API is enabled in your Google Cloud project

2. **Spreadsheet Not Found**:
   - Verify the spreadsheet ID in your environment variables
   - Make sure the spreadsheet is shared with your service account

3. **Rate Limiting**:
   - Google Sheets API has usage limits
   - Implement appropriate retry logic for production applications

4. **Deployment Issues**:
   - Check Railway build logs for detailed error messages
   - Verify all environment variables are set correctly
   - Ensure your Dockerfile builds successfully locally

For more help, check the logs or create an issue in the repository.