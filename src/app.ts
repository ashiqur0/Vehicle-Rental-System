import express, { Request, Response } from 'express';
import initDb from "./config/db";
import { authRoutes } from './modules/auth/auth.routes';
import { vehicleRoutes } from './modules/vehicles/vehicle.route';
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

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/users', userRoutes);

export default app;