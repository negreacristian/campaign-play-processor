import { MongoClient, Db } from 'mongodb';
import { config } from '../config/env';

let db: Db;


// connect to Mongo and return Mongo instance

export const connectToMongo = async (): Promise<Db> => {
  if (!db) {
    const client = new MongoClient(config.mongoUri);
    await client.connect();
    db = client.db();
  }
  return db;
};

