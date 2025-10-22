import { Queue } from 'bullmq';
import { CampaignEvent } from '../types/campaignEvent';
import { config } from '../config/env';
import Redis from 'ioredis';

// Create Redis connection using shared config
const connection = new Redis({
  host: config.redisHost,
  port: config.redisPort
});

// Create queue using bullmq called play-events
export const playEventQueue = new Queue<CampaignEvent>('play-events', {
  connection 
});
