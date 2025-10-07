import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from './config/environment';
import logger from './config/logger';
import { errorHandler, notFoundHandler, requestLogger } from './middleware';
import sheetsRoutes from './routes/sheets';

class Server {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = config.PORT;
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  /**
   * Initialize middleware
   */
  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: false, // Disable CSP for API
      crossOriginEmbedderPolicy: false,
    }));

    // CORS configuration
    this.app.use(cors({
      origin: config.CORS_ORIGIN === '*' ? true : (config.CORS_ORIGIN || '').split(','),
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.RATE_LIMIT_WINDOW_MS || 900000,
      max: config.RATE_LIMIT_MAX_REQUESTS || 100,
      message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.',
        timestamp: new Date().toISOString(),
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use(limiter);

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use(requestLogger);

    logger.info('Middleware initialized successfully');
  }

  /**
   * Initialize routes
   */
  private initializeRoutes(): void {
    // Health check route
    this.app.get('/health', (req, res) => {
      res.json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.NODE_ENV,
      });
    });

    // API routes
    this.app.use('/api/v1/sheets', sheetsRoutes);

    // Root route
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'Google Sheets REST API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
          health: '/health',
          sheets: '/api/v1/sheets',
        },
      });
    });

    logger.info('Routes initialized successfully');
  }

  /**
   * Initialize error handling
   */
  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);

    logger.info('Error handling initialized successfully');
  }

  /**
   * Start the server
   */
  public start(): void {
    this.app.listen(this.port, () => {
      logger.info(`Server started successfully`, {
        port: this.port,
        environment: config.NODE_ENV,
        timestamp: new Date().toISOString(),
      });
      
      if (config.NODE_ENV === 'development') {
        logger.info('API Endpoints:', {
          root: `http://localhost:${this.port}/`,
          health: `http://localhost:${this.port}/health`,
          sheets: `http://localhost:${this.port}/api/v1/sheets`,
        });
      }
    });

    // Graceful shutdown
    process.on('SIGTERM', this.gracefulShutdown.bind(this));
    process.on('SIGINT', this.gracefulShutdown.bind(this));
  }

  /**
   * Graceful shutdown
   */
  private gracefulShutdown(): void {
    logger.info('Received shutdown signal, closing server gracefully...');
    
    process.exit(0);
  }

  /**
   * Get Express app instance
   */
  public getApp(): Application {
    return this.app;
  }
}

export default Server;