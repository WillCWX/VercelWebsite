"use client";

import { useEffect } from "react";

// One-time cleanup for the coi-serviceworker that used to be registered
// here (replaced by real COOP/COEP headers in next.config.mjs). Browsers
// that already installed it keep running it - and it keeps intercepting
// every request - until it's explicitly unregistered.
export function UnregisterStaleServiceWorkers() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      if (registrations.length === 0) {
        return;
      }
      Promise.all(
        registrations.map((registration) => registration.unregister()),
      ).then(() => window.location.reload());
    });
  }, []);

  return null;
}
