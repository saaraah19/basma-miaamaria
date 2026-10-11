"use client";

import { useEffect } from "react";

// The API sleeps on Render's free plan and takes up to a minute to wake. The
// public pages are static so they never wait for it — but a form submit does.
// This fires ONE throwaway request the moment a visitor lands on a page with a
// form, so by the time they've typed their message the API is already awake.
// (Deliberately not on every page: it would keep the API awake all day and
// eat the workspace's monthly free-hours allowance.)
export default function ApiWarmup() {
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL;
    if (!base) return;
    fetch(`${base}/content/navbar`, { mode: "no-cors", cache: "no-store" }).catch(() => {});
  }, []);
  return null;
}
