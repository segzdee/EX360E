'use client'

import { useEffect } from 'react'

export function HydrationHandler() {
  useEffect(() => {
    // @ts-ignore
    window.__NEXT_HYDRATION_MARK_CLEANUP__ = true;
  }, []);

  return null;
}

