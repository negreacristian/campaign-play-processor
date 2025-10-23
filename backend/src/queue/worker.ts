import { Worker } from 'bullmq';
import { CampaignEvent } from '../types/campaignEvent';
import { connectToMongo } from '../db/mongo';
import { config } from '../config/env';


// create a worker to listen for events in the queue
const worker = new Worker<CampaignEvent>( 'play-events', async job => {

    console.log(' RECEIVED EVENT IN WORKER:', job.data);

    
    const db = await connectToMongo();

    console.log(' CONNECTED to Mongo:', db.databaseName);

    //get the collection
    const eventsCollection = db.collection('all_events');


    // get each
    const {campaign_id, screen_id, timestamp} = job.data;

    
    // insert every event as a separate document
    await eventsCollection.insertOne({
      campaign_id: campaign_id,
      screen_id: screen_id,
      timestamp: timestamp
    });
    

    // log
    console.log(' UPDATED Mongo for:', job.data.campaign_id);
  },

  // listen to Redis queue
  {
   connection: {
  host: config.redisHost,
  port: Number(config.redisPort)
}
  }
);
