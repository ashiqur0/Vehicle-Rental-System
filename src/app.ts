import express, { Request, Response } from 'express';
import initDb from "./config/db";

const app = express();

// initialize database
initDb();

// root route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Vehicle Rental System API!');
});

export default app;