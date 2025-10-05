import dotenv from 'dotenv' ;
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';

import  supabase  from './config/database'; 

import authRoutes from './routes/auth';
import grievancesRoutes from './routes/grievances';
import announcementsRoutes from './routes/announcements';
import dashboardRoutes from './routes/dashboard';
import servicesRoutes from './routes/services';
import zonesRoutes from './routes/zones';
import citizensRoutes from './routes/citizens';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, 
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/grievances', grievancesRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/zones', zonesRoutes);
app.use('/api/citizens', citizensRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Smart City Management System API',
    version: '1.0.0',
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);

  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }

  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large' });
  }

  return res.status(500).json({ 
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: err?.message })
  });
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
  // Check if the Supabase client was initialized correctly
  if (supabase) {
    console.log('Supabase client initialized successfully.');
  } else {
    console.error('Error initializing Supabase client!');
  }
});

export default app;

