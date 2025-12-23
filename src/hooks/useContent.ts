"use client";

import { useState, useEffect } from "react";
import localData from "@/data/content.json";
import { getSiteContent } from "@/lib/siteService";

export function useContent() {
  const [data, setData] = useState(localData);

  useEffect(() => {
    async function loadData() {
      try {
        const freshData = await getSiteContent();
        // Robust check: Ensure we actually got a valid site configuration
        if (freshData && freshData.hero && freshData.hero.title) {
          setData(freshData as any);
        } else {
          console.log("Firebase data missing key properties, staying with local data.");
        }
      } catch (err) {
        console.error("useContent hook error:", err);
      }
    }
    loadData();
  }, []);

  return data;
}
