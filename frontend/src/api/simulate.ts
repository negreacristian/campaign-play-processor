// src/api/simulate.ts

export const simulateEvent = async (): Promise<void> => {
  const screens = ['screen-101', 'screen-102', 'screen-103', 'screen-104', 'screen-105'];
  const campaigns = ['cmp-2025-001', 'cmp-2025-002', 'cmp-2025-003', 'cmp-2025-004', 'cmp-2025-005'];

  // pick one random screen and campaign
  const screen_id = screens[Math.floor(Math.random() * screens.length)];
  const campaign_id = campaigns[Math.floor(Math.random() * campaigns.length)];

  // generate timestamp
  const timestamp = new Date().toISOString();

  const event = { screen_id, campaign_id, timestamp };

  // send POST request to backend
  const res = await fetch('http://localhost:3000/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  });

  if (!res.ok) throw new Error('Failed to simulate event');
  
};
