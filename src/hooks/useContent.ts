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
        const freshData = await getSiteContent() as any;
        // Only update if we have a valid hero and it's different from local
        if (freshData && freshData.hero && freshData.hero.title) {
          // Robustness: ensure critical arrays exist even if missing in Firestore
          if (!freshData.services) freshData.services = localData.services || [];
          if (!freshData.socialReels) freshData.socialReels = localData.socialReels || [];
          if (!freshData.projects) freshData.projects = localData.projects || [];
          if (!freshData.visualArchive) freshData.visualArchive = localData.visualArchive || [];
          if (!freshData.about) freshData.about = localData.about;
          if (!freshData.navigation) freshData.navigation = localData.navigation;
          if (!freshData.contact) freshData.contact = localData.contact;
          if (!freshData.categories) freshData.categories = localData.categories;
          
          setData(freshData);
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
