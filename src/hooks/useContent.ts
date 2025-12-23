"use client";

import { useState, useEffect } from "react";
import localData from "@/data/content.json";
import { getSiteContent } from "@/lib/siteService";

export function useContent() {
  const [data, setData] = useState(localData);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const freshData = await getSiteContent();
        // Only update if we have a valid hero and it's different from local
        if (freshData && freshData.hero && freshData.hero.title) {
          setData(freshData as any);
          setIsLive(true);
        }
      } catch (err) {
        console.warn("useContent: Using high-fidelity local fallback.", err);
      }
    }
    loadData();
  }, []);

  return data;
}
