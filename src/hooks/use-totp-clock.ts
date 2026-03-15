import { useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
let intervalId: number | null = null;
let currentEpochSecond: number | null = null;

function getEpochSecond() {
  return Math.floor(Date.now() / 1000);
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

function tick() {
  const nextEpochSecond = getEpochSecond();

  if (nextEpochSecond === currentEpochSecond) {
    return;
  }

  currentEpochSecond = nextEpochSecond;
  emitChange();
}

function startClock() {
  if (intervalId !== null) {
    return;
  }

  currentEpochSecond = getEpochSecond();
  intervalId = window.setInterval(tick, 1000);
}

function stopClock() {
  if (intervalId === null) {
    return;
  }

  window.clearInterval(intervalId);
  intervalId = null;
  currentEpochSecond = null;
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  if (listeners.size === 1) {
    startClock();
  }

  return () => {
    listeners.delete(listener);

    if (listeners.size === 0) {
      stopClock();
    }
  };
}

function getSnapshot() {
  return currentEpochSecond ?? getEpochSecond();
}

export function useTotpClock() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
