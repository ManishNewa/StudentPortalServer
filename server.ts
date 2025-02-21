import express, { Request, Response } from 'express'
import path from 'path'
import apiRoutes from './routes/api'

const app = express()
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')))

// API routes
app.use('/api', apiRoutes)

// Serve the Vue app for all other routes
// app.get('*', (req: Request, res: Response) => {
//   res.sendFile(path.join(__dirname, '../public/index.html'))
// })

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Node.js!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
