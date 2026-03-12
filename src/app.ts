import express, { Request, Response } from 'express';
import initDb from "./config/db";
import { userRoutes } from './modules/users/user.routes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// initialize database
initDb();

// root route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Vehicle Rental System API!');
});

app.use('/users', userRoutes);

export default app;