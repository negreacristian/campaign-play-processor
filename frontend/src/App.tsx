import React from 'react';
import { Navigate, Route, Routes,} from 'react-router-dom';
import { Box, Container } from '@mui/material';

import NavigationBar from './pages/components/navigationBar'; 
import CampaignsPage from './pages/campaignsPage';
import ScreensPage from './pages/screensPage';

const App = () => (
  <Box
    sx={{
      minHeight: '100vh',
      backgroundColor: (theme) => theme.palette.background.default,
    }}
  >
    <NavigationBar />

    {/* page content */}
    
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Routes>
        <Route path="/" element={<Navigate to="/campaigns" replace />} />
        <Route path="/campaigns" element={<CampaignsPage />} />
        <Route path="/screens" element={<ScreensPage />} />
        <Route path="*" element={<Navigate to="/campaigns" replace />} />
      </Routes>
    </Container>
  </Box>
);

export default App;
