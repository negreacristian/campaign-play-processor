import React from 'react';
import { List, ListItem, Paper, Skeleton, Typography, Box } from '@mui/material';
import type { DashboardRow } from '../../../hooks/useDashboardData';

type StatsListProps = {
  rows: DashboardRow[];
  loading: boolean;
  emptyLabel: string;
};

const StatsList: React.FC<StatsListProps> = ({ rows, loading, emptyLabel }) => {
  // loading state: show a consistent skeleton layout
  if (loading) {
    return (
      <Paper sx={{ p: 1 }}>
        <List disablePadding>
          {Array.from({ length: 8 }).map((_, index) => (
            <ListItem
              key={index}
              divider
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}
            >
              {/* Label skeleton */}
              <Skeleton variant="text" width="40%" />
      
              <Box sx={{ minWidth: 96, textAlign: 'right' }}>
                <Skeleton variant="text" width="60%" />
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
    );
  }

  // Empty state: show a friendly message when there are no rows
  if (!rows?.length) {
    return (
      <Paper sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {emptyLabel}
        </Typography>
      </Paper>
    );
  }

  // data state: labels on the left, totals on the right
  return (
    <Paper sx={{ p: 1 }}>
      <List disablePadding>
        {rows.map((row, index) => (
          <ListItem
            key={row.label}
            divider={index < rows.length - 1}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}
          >
            {/* Label */}
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {row.label}
            </Typography>

            {/* Total (right aligned) */}
            <Box sx={{ minWidth: 96, textAlign: 'right' }}>
              <Typography variant="body2" color="text.secondary">
                {row.total} plays
              </Typography>
            </Box>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default StatsList;
