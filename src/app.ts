import express, { json } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import connectDB from './config/database';
import { handleError } from './utils/error';
require('dotenv').config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/nfts', require('./routes/nft.routes'));

// Error handling
app.use(handleError);

export default app;