import 'reflect-metadata';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth-routes';
import sequelize from './config/db';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

sequelize.sync().then(() => {
    console.log('Database synced');
});

export default app;
