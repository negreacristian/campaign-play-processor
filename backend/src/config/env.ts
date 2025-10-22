import dotenv from 'dotenv';


// choose what env to use
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev'
});

// export a config object with fallback defaults if env vars are missing
export const config = {

  // redis host (default to redis if not set)
  redisHost: process.env.REDIS_HOST || 'redis',

  // Redis port (default to 6379)
  redisPort: Number(process.env.REDIS_PORT) || 6379,

  // Mongo (default to container name/port/dbname)
  mongoUri: process.env.MONGO_URI || 'mongodb://mongo:27017/campaignDB'
};
