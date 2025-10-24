import React from 'react';
import { Paper, Typography, Skeleton, Box, useTheme } from '@mui/material';
import {ResponsiveContainer,BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, } from 'recharts';


type Row = { label: string; total: number };


// props for the bar chart.

type Props = {

  rows: Row[];

  loading: boolean;

  emptyLabel: string;

  title?: string;
};


const StatsBarChart: React.FC<Props> = ({ rows, loading, emptyLabel, title }) => {
  const theme = useTheme();

 
  // recharts expects keys like { name, value }
  const data = React.useMemo(
    () => (rows ?? []).map((r) => ({ name: r.label, total: r.total })),
    [rows]
  );

  // Convenient flags for rendering branches
  const hasData = !loading && data.length > 0;

  const truncate = (s: string, max = 18) => (s.length > max ? `${s.slice(0, max - 1)}…` : s);

  // space reserved for X axis labels 
  // if labels wrap or rotate later, adjust this number
  const xAxisHeight = hasData ? 56 : 32;


  const maxXTicks = hasData ? Math.min(10, data.length) : 0;

  // -- UI ---------------------------------------------------------------------
  return (
    <Paper
      sx={{
        p: 2,
        height: 520, 
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        flex: 1,
      }}
      aria-label="Bar chart: totals distribution"
      role="region"
    >
      {/* Title */}
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        {title || 'Totals distribution'}
      </Typography>

      {/* Loading state */}
      {loading && (
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="rounded" width="100%" height="100%" />
        </Box>
      )}

      {/* Empty state */}
      {!loading && !hasData && (
        <Box sx={{ flex: 1, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {emptyLabel}
          </Typography>
        </Box>
      )}

      {/* Chart */}
      {hasData && (
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 8, right: 12, left: 12, bottom: 0 }}
            >
        
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              {/* X axis (labels) */}
              <XAxis
                dataKey="name"
                height={xAxisHeight}
                tickCount={maxXTicks}
                interval="preserveStartEnd" // let Recharts pick a smart subset of ticks
                tick={{
                  fontSize: 12,
                }}
                tickFormatter={(v: string) => truncate(v)}
              />

              {/* Y axis (numeric totals) */}
              <YAxis
                allowDecimals={false}
                minTickGap={6}
                tick={{ fontSize: 12 }}
              />

              {/* Hover tooltip */}
              <RechartsTooltip
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                formatter={(value: number) => [value, 'Total']}
                labelFormatter={(label: string) => label}
                wrapperStyle={{ zIndex: 1 }}
              />

              {/* The bars themselves. Rounded top corners for a softer look. */}
              <Bar
                dataKey="total"
                name="Total"
                fill={theme.palette.primary.main}
                radius={[6, 6, 0, 0]}
                maxBarSize={70} 
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
};

export default StatsBarChart;
