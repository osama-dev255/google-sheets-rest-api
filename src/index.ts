import Server from './server';
import logger from './config/logger';

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception', {
    name: error.name,
    message: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Rejection', {
    reason: reason?.toString() || 'Unknown reason',
    stack: reason?.stack || 'No stack trace',
  });
  process.exit(1);
});

// Create and start server
function startApplication(): void {
  try {
    logger.info('Starting Google Sheets REST API server...');
    
    const server = new Server();
    server.start();
    
    logger.info('Application started successfully');
  } catch (error: any) {
    logger.error('Failed to start application', {
      error: error?.message || 'Unknown error',
      stack: error?.stack || 'No stack trace',
    });
    process.exit(1);
  }
}

// Start the application
startApplication();