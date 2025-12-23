"use client";

import { useState, useEffect } from "react";
import localData from "@/data/content.json";
import { getSiteContent } from "@/lib/siteService";

export function useContent() {
  const [data, setData] = useState(localData);

  useEffect(() => {
    async function loadData() {
      const freshData = await getSiteContent();
      if (freshData) {
        setData(freshData as any);
      }
    }
    loadData();
  }, []);

  return data;
}
