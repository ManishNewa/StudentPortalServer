import express, { Request, Response } from 'express';
import { AppDataSource } from './config/db';
import path from 'path';
import apiRoutes from './routes/api';

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api', apiRoutes);

// Initialize DB
AppDataSource.initialize()
    .then(() => {
        console.log('DB connected');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => console.log('Database connection failed:', error));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript with Node.js!');
});
