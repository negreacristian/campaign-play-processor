
import { Campaign } from '../types/campaign';


// async function to fetch campaings from the backend

export const fetchCampaigns = async (): Promise<Campaign[]> => {
  
  // GET request to the backend api 
  const res = await fetch('http://localhost:3000/events');

  // if res not ok then error
  if (!res.ok) {
    throw new Error('Failed to fetch campaigns');
  }

  //parse the json and return it as an array
  return res.json();
};
