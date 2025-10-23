import React from 'react';
import DashboardPage from './components/dashboardPage';

// this component renders a dashboard grouped by campaign ID

const CampaignsPage: React.FC = () => (
  <DashboardPage
    groupBy="campaign_id" 
    title="Campaigns"
    emptyLabel="There are currently no tracked campaigns." 
  />
);

export default CampaignsPage;
