import { Worker } from 'bullmq';
import { CampaignEvent } from '../../types/types';
import { connectToMongo } from '../../db/mongo';
import { config } from '../../config/env';

// create a worker to listen for events in the queue
const worker = new Worker<CampaignEvent>( 'play-events', async job => {

    console.log(' RECEIVED EVENT IN WORKER:', job.data);

    
    const db = await connectToMongo();

    console.log(' CONNECTED to Mongo:', db.databaseName);

    //get the collection
    const stats = db.collection('campaign_stats');


    //check if the campaing is in the db
    const {campaign_id, screen_id} = job.data;
    const exist= await stats.findOne({ campaign_id });
    
    //update the doc with the matching campaign_id

    if (exist){

      // increment
      await stats.updateOne(
        { campaign_id },
        { $inc: { total_plays: 1 } }
      );
      console.log(` INCREMENTED total_plays for: ${campaign_id}`);
    }
    else{
      // new record
      await stats.insertOne({
        campaign_id,
        screen_id,
        total_plays: 1
      });
      console.log(` INSERTED new campaign record for: ${campaign_id}`);

    }

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
