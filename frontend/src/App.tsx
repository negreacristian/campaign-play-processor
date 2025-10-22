import React, { useEffect, useState } from 'react';
import { fetchCampaigns } from './api/api';
import { Campaign } from './types/campaign';
import { simulateEvent } from './api/simulate';

// main component
const App = () => {

  // storage for campaigns
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  // set loading true 
  const [loading, setLoading] = useState(true);

  // start fetch 
  useEffect(() => {
    fetchCampaigns()
      // save result and show errors
      .then(setCampaigns)
      .catch(console.error)
      .finally(() => setLoading(false)); // stop loading
  }, []);


  if (loading) return <p>Loading...</p>;
  if (campaigns.length === 0) return <p>No campaigns found.</p>;

  // return html
  return (

    <div>
      <button onClick={simulateEvent}>Simulate Event</button>

      <h2>Campaign Stats</h2>
      <ul>
        {campaigns.map(c => (
          <li key={c._id}>
            {c.campaign_id} – {c.screen_id} – {c.total_plays} plays
          </li>
        ))}
      </ul>
    </div>
   
  );
};

export default App;
