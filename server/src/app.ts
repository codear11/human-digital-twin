import express from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import apiRouter from './routes';
import { errorHandler } from './middleware/error.middleware';

export const app = express();

// Middlewares
app.use(cors({
  origin: [ENV.CORS_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));

app.use(express.json());

// Request logger in development
if (ENV.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// Mount API routes
app.use('/api', apiRouter);

// Centralized error handling
app.use(errorHandler);

// Start server if run directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(ENV.PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Human Digital Twin Server running on port ${ENV.PORT}`);
    console.log(`🔗 API Base URL: http://localhost:${ENV.PORT}/api`);
    console.log(`📊 Mode: ${ENV.NODE_ENV}`);
    console.log(`====================================================`);
  });
}
