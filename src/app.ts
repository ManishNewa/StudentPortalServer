import 'reflect-metadata';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth-routes';
import sequelize from './config/db';
import { sessionConfig } from './config/session';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(sessionConfig);

// Routes
app.use('/api/auth', authRoutes);

// DB
sequelize.sync().then(() => {
    console.log('Database synced');
});

export default app;
