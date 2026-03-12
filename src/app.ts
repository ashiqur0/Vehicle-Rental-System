import express, { Request, Response } from 'express';
import initDb from "./config/db";
import { authRoutes } from './modules/auth/auth.routes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// initialize database
initDb();

// root route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Vehicle Rental System API!');
});

app.use('/api/v1/auth/signup', authRoutes);

export default app;