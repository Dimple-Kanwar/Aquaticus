import express, { json , Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import "dotenv/config";
import nftRoutes from "./routes/nft.routes";
import pinataRoutes from "./routes/pinata.routes";
// import { handleError } from './utils/error';

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(helmet());
app.use(cors());
app.use(json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/nfts', nftRoutes);
app.use('/api/ipfs', pinataRoutes);
app.get('/', (req: Request, res: Response) => {
  res.send('Server is running!');
});

// Error handling
// app.use(handleError);


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});