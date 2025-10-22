import express from 'express';
import cors from 'cors';
import eventRoutes from './api/events';
import './queue/redis/processor';

// use express for JSON
const app = express();

// use cors for cross origin
app.use(cors());
app.use(express.json());

// api
app.use('/events', eventRoutes);

// run the backend
app.listen(3000, () => console.log('Backend running on port 3000'));
