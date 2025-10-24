import React from 'react';
import { Container, Box, Button, Typography, Card, CardContent, Stack, Tooltip, Divider, useTheme } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { useDashboardData } from '../../hooks/useDashboardData';
import StatsList from './boards/statsList';
import { useEventSimulator } from '../../hooks/useEventSimulator';
import StatsBarChart  from './boards/statsBarChart';

// defines the props for the DashboardPage component
interface DashboardPageProps {
  groupBy: 'campaign_id' | 'screen_id';
  emptyLabel: string;
  title?: string;
}

// event simulation
const SIMULATION_INTERVAL_MS = 10_000;

const DashboardPage: React.FC<DashboardPageProps> = ({ groupBy, emptyLabel, title }) => {
  // state to control whether random event simulation is active
  const theme = useTheme();

  // use the custom hook to fetch data, aligning the refresh cadence with simulation interval
  const { loading, rows, refresh } = useDashboardData(groupBy, SIMULATION_INTERVAL_MS);

  // sim
  const { running: autoSimulate, toggle, triggerOnce } = useEventSimulator({intervalMs: SIMULATION_INTERVAL_MS,onBatchComplete: refresh,});


  return (
    <Container maxWidth={false} sx={{ mt: 4, pb: 6 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: 'stretch' }}>
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex' }}>
          <Card sx={{ height: '100%', flex: 1 }}>
            <CardContent>
              
              {/* header */}
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Box>

                  {/* display the optional title */}
                  {!!title && (
                    <Typography variant="h5" sx={{ mb: 0.5 }}>
                      {title}
                    </Typography>
                  )}
                  
                  {/* display the current grouping dimension */}
                  <Typography variant="subtitle2" color="text.secondary">
                    Grouped by <strong>{groupBy}</strong>
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ mb: 2 }} />


              <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ mb: 2 }}>
                {/* button to trigger a single event manually */}
                <Tooltip title="Create one test event right now">
                  <Button
                    aria-label="Trigger one event"
                    variant="contained"
                    color="error"
                    sx={{ fontWeight: 600 }}
                    onClick={triggerOnce}
                  >
                    Simulate Event
                  </Button>
                </Tooltip>

                {/* button to toggle auto-simulation */}
                <Tooltip title={autoSimulate ? 'Stop generating random events' : 'Start generating random events periodically'}>
                  <Button
                    aria-label={autoSimulate ? 'Stop random events' : 'Start random events'}
                    variant="contained"
                    // change color based on simulation state 
                    color={autoSimulate ? 'inherit' : 'error'}
                    sx={
                      autoSimulate
                        ? {
                          
                            backgroundColor: theme.palette.grey[700],
                            color: theme.palette.grey[100],
                            fontWeight: 600,
                            '&:hover': { backgroundColor: theme.palette.grey[600] },
                          }
                        : { fontWeight: 600 } // default style for 'Start' state
                    }
                    // change icon based on simulation state
                    startIcon={autoSimulate ? <StopIcon /> : <PlayArrowIcon />}
                    // toggle the autoSimulate state
                    onClick={toggle}
                  >
                    {autoSimulate ? 'Stop Random' : 'Random Events'}
                  </Button>
                </Tooltip>
              </Stack>



              {/* stats list component */}
              <Box sx={{ borderRadius: 2 }}>
                <StatsList rows={rows} loading={loading} emptyLabel={emptyLabel} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0, display: 'flex' }}>
          <StatsBarChart
            rows={rows}
            loading={loading}
            emptyLabel={emptyLabel}
            title="Bar Chart – Plays"
          />
        </Box>
      </Stack>
    </Container>
  );
};

export default DashboardPage;
