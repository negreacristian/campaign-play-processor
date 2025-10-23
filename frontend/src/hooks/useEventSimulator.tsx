import { useCallback, useEffect, useRef, useState } from 'react';
import { simulateEvent } from '../api/simulate';

type UseEventSimulatorOptions = {
  intervalMs?: number;
  onBatchComplete?: () => Promise<void> | void;
};

export function useEventSimulator({
  intervalMs = 10_000,
  onBatchComplete,
}: UseEventSimulatorOptions = {}) {
  // state to control whether random event simulation is active
  const [running, setRunning] = useState(false);

  // refs for the interval and for preventing overlapping batches
  const timerRef = useRef<number | null>(null);
  const lockRef = useRef(false);
  const unmountedRef = useRef(false);

  // internal constants for the burst size (not exposed in the hook API)
  const BATCH_MIN = 1;
  const BATCH_MAX = 5;

  // runs a batch of events (1..N) and then notifies the UI via onBatchComplete
  const runBatch = useCallback(async () => {
    // prevent concurrent batches or execution after unmount
    if (lockRef.current || unmountedRef.current) return;
    lockRef.current = true;
    try {
      const count = Math.floor(Math.random() * (BATCH_MAX - BATCH_MIN + 1)) + BATCH_MIN;
      for (let i = 0; i < count; i++) {
        await simulateEvent();
      }
      await onBatchComplete?.();
    } finally {
      lockRef.current = false;
    }
  }, [onBatchComplete]);

  // allows manually triggering a single event + refreshing the UI
  const triggerOnce = useCallback(async () => {
    await simulateEvent(); // Fire the event
    await onBatchComplete?.(); // Immediately fetch the new data to update the UI
  }, [onBatchComplete]);

  // effect that starts/stops the interval for auto-simulation
  useEffect(() => {
    unmountedRef.current = false;

    // If auto-simulate is off, do nothing
    if (!running) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Set up the interval to auto-generate a small burst of events
    timerRef.current = window.setInterval(() => {
      void runBatch();
    }, intervalMs) as unknown as number;

    // Cleanup: Clear the interval when the component unmounts or running is toggled off
    return () => {
      unmountedRef.current = true;
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [running, intervalMs, runBatch]);

  return {
    running,
    start: () => setRunning(true),
    stop:  () => setRunning(false),
    toggle: () => setRunning((prev) => !prev),
    triggerOnce,
  };
}
