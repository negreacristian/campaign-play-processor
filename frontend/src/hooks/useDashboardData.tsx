import { useCallback, useEffect, useState } from 'react';
import { fetchCampaigns } from '../api/fetchEvents';
import type { Campaign } from '../types/campaign';

// defines the structure for a single row in the dashboard
export type DashboardRow = {
  label: string;
  total: number;
};

// options to configure the data fetching and aggregation
type UseDashboardDataOptions = {
  groupBy: 'campaign_id' | 'screen_id';
  refreshMs?: number; // polling interval in milliseconds
};

const DEFAULT_REFRESH_MS = 10_000; // default 10 second polling interval for live data
const MAX_ROWS = 20; // maximum number of rows to display in the dashboard

// @param data the raw array of campaign events.
// @param groupBy the field to use for grouping
// @returns An array of DashboardRow objects.
const buildRows = (data: Campaign[], groupBy: 'campaign_id' | 'screen_id'): DashboardRow[] => {
  if (!data?.length) return [];

  const groupCounts = data.reduce<Record<string, number>>((acc, item) => {
    // use the value of the groupBy field as the key
    const key = (item[groupBy] as string) || 'N/A';

    // increment the count for this key
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(groupCounts)
    .map(([label, total]) => ({ label, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, MAX_ROWS);
};

// @param groupBy the dimension to aggregate by.
// @param refreshMs the polling interval in milliseconds
// @returns An object containing the aggregated rows, a loading state, and a manual refresh function.
export const useDashboardData = (
  groupBy: 'campaign_id' | 'screen_id',
  refreshMs: number = DEFAULT_REFRESH_MS
) => {
  // state to hold the final, aggregated data rows for rendering
  const [rows, setRows] = useState<DashboardRow[]>([]);

  // state to indicate if data is currently being loaded
  const [loading, setLoading] = useState(true);

  // fetch routine wrapped in useCallback to ensure stable reference
  const load = useCallback(async () => {
    try {
      // fetch raw data from the API
      const data = await fetchCampaigns();
      const safeData = data ?? [];

      // aggregate the data into dashboard rows
      setRows(buildRows(safeData, groupBy));
    } finally {
      // ensure loading state is turned off regardless of success or failure
      setLoading(false);
    }
  }, [groupBy]);

  // calls 'load' immediately
  useEffect(() => {
    load().catch(console.error);
  }, [load]);

  // effect polling
  useEffect(() => {
    if (!refreshMs) return;

    // Set up the interval timer to call 'load' repeatedly
    const id = window.setInterval(() => {
      load().catch(console.error);
    }, refreshMs);

    // cleanup function: clear the interval when the component unmounts or dependencies change
    return () => clearInterval(id);
  }, [refreshMs, load]);

  return {
    rows,
    loading,
    refresh: load,
  };
};
