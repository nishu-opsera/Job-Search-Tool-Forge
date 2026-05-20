import { useEffect, useState } from "react";

function secondsUntil(expiresAtMs: number): number {
  return Math.max(0, Math.ceil((expiresAtMs - Date.now()) / 1000));
}

export function useRateLimitCountdown(expiresAtMs: number | null) {
  const [secondsRemaining, setSecondsRemaining] = useState(() =>
    expiresAtMs ? secondsUntil(expiresAtMs) : 0,
  );

  useEffect(() => {
    if (!expiresAtMs) {
      setSecondsRemaining(0);
      return;
    }

    const tick = () => {
      setSecondsRemaining(secondsUntil(expiresAtMs));
    };

    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [expiresAtMs]);

  const isActive = expiresAtMs !== null && secondsRemaining > 0;

  return { secondsRemaining, isActive };
}
