import { Router, Request, Response } from 'express';
import { playEventQueue } from '../queue/redisQueue';
import { CampaignEvent } from '../types/campaignEvent';
import { connectToMongo } from '../db/mongo';

const router = Router();

// POST /events - add event into Redis queue using async

router.post('/', async (req: Request, res: Response) => {

  // create object
   const event: CampaignEvent = req.body;

  // check for empty fields
  if (!event.screen_id || ! event.campaign_id || !event.timestamp) {
    return res.status(400).json({ message: 'Missing required fields' });
  }


  // add events to queue
  await playEventQueue.add('new-event', event);

  // success respond 
  res.status(200).json({ message: 'Event added to Redis queue' });
});

// GET /events - return campaigns with their Counts from Mongo
router.get('/', async (_req: Request, res: Response) => {
  try {

    // connect to Mongo

    const db = await connectToMongo();
    const collection = db.collection('campaign_stats');

    // fetch all from campaign_stats collection
    const campaigns = await collection.find().toArray();

    // return JSON
    res.status(200).json(campaigns);
  } 
    catch (err) {
    
    // handle and log errors 
    console.error(' Failed to fetch campaigns:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
export default router;
