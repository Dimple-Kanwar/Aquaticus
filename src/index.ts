import 'reflect-metadata';
import express, { json , Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import "dotenv/config";
import nftRoutes from "./routes/nft.routes";
import pinataRoutes from "./routes/pinata.routes";
import { ValidationPipe } from '@nestjs/common';
// import { handleError } from './utils/error';

export const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(helmet());
app.use(cors());
app.use(json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/assets', nftRoutes);
app.use('/api/pinata', pinataRoutes);
app.get('/', (req: Request, res: Response) => {
  res.send('Server is running!');
});

// For NestJS
// app.use(new ValidationPipe({
//   transform: true,
//   whitelist: true,
//   forbidNonWhitelisted: true
// }));

// Error handling
// app.use(handleError);


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});