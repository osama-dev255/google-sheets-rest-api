import dotenv from 'dotenv';
import { EnvironmentConfig } from '../types';
import logger from './logger';

// Load environment variables
dotenv.config();

// Validate and parse environment variables
function validateEnvironment(): EnvironmentConfig {
  const requiredEnvVars = [
    'GOOGLE_SHEETS_PRIVATE_KEY',
    'GOOGLE_SHEETS_CLIENT_EMAIL',
    'GOOGLE_SHEETS_PROJECT_ID',
    'GOOGLE_SHEETS_SPREADSHEET_ID',
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    const errorMessage = `Missing required environment variables: ${missingVars.join(', ')}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  // Process private key to ensure proper formatting
  let privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY || '';
  
  // Log key length for debugging (without exposing the key)
  logger.info('Private key processing', { 
    keyLength: privateKey.length,
    hasBegin: privateKey.includes('-----BEGIN'),
    hasEnd: privateKey.includes('-----END')
  });
  
  // Replace escaped newlines and trim
  privateKey = privateKey.replace(/\\\\n/g, '\n').trim();
  
  // Additional validation
  if (!privateKey.includes('-----BEGIN PRIVATE KEY-----') || 
      !privateKey.includes('-----END PRIVATE KEY-----')) {
    logger.error('Private key format appears invalid');
    throw new Error('Invalid private key format');
  }

  const config: EnvironmentConfig = {
    NODE_ENV: (process.env.NODE_ENV as EnvironmentConfig['NODE_ENV']) || 'development',
    PORT: parseInt(process.env.PORT || '3000', 10),
    GOOGLE_SHEETS_PRIVATE_KEY: privateKey,
    GOOGLE_SHEETS_CLIENT_EMAIL: process.env.GOOGLE_SHEETS_CLIENT_EMAIL!,
    GOOGLE_SHEETS_PROJECT_ID: process.env.GOOGLE_SHEETS_PROJECT_ID!,
    GOOGLE_SHEETS_SPREADSHEET_ID: process.env.GOOGLE_SHEETS_SPREADSHEET_ID!,
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  };
  
  return config;
}

// Export validated configuration
export const config: EnvironmentConfig = validateEnvironment();

// Log configuration (without sensitive data)
logger.info('Environment configuration loaded', {
  NODE_ENV: config.NODE_ENV,
  PORT: config.PORT,
  GOOGLE_SHEETS_PROJECT_ID: config.GOOGLE_SHEETS_PROJECT_ID,
  GOOGLE_SHEETS_SPREADSHEET_ID: config.GOOGLE_SHEETS_SPREADSHEET_ID,
  CORS_ORIGIN: config.CORS_ORIGIN,
});

export default config;