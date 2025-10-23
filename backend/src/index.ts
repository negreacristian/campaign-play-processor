import express from 'express';
import cors from 'cors';
import eventRoutes from './routes/events';
import './queue/worker';

// use express for JSON
const app = express();

// use cors for cross origin
app.use(cors());
app.use(express.json());

// api
app.use('/', eventRoutes);

// run the backend
app.listen(3000, () => console.log('Backend running on port 3000'));
