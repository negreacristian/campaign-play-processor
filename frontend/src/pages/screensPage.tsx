import React from 'react';
import DashboardPage from './components/dashboardPage';

// this component renders a dashboard grouped by screen ID

const ScreensPage: React.FC = () => (
  <DashboardPage
    groupBy="screen_id" 
    title="Screens" 
    emptyLabel="No screens have recorded any plays." />
);

export default ScreensPage;
