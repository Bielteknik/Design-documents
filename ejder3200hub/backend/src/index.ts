// FIX: Consolidated Express imports into a single statement to resolve type errors with Request, Response, and middleware handling.
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { prisma } from './prisma';

import projectRoutes from './routes/projects';
import taskRoutes from './routes/tasks';
import resourceRoutes from './routes/resources';
import ideaRoutes from './routes/ideas';
import eventRoutes from './routes/events';
import departmentRoutes from './routes/departments';
import commentRoutes from './routes/comments';


const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/comments', commentRoutes);


// A simple test route to check if the API is running
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to ejder3200Hub API! It\'s running!' });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', message: err.message });
});


async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful');

    app.listen(port, () => {
      console.log(`🚀 Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to database', error);
    // FIX: Correctly call `process.exit` to terminate the application, as `exit` is a method on the global `process` object.
    process.exit(1);
  }
}

main();