import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import localData from "@/data/content.json";

const DOC_ID = "main-content";
const COLLECTION = "site-config";

export async function getSiteContent() {
  try {
    const docRef = doc(db, COLLECTION, DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // If it doesn't exist in Firebase yet, return local JSON
      return localData;
    }
  } catch (error) {
    console.error("Error fetching from Firebase:", error);
    return localData;
  }
}

export async function updateSiteContent(data: any) {
  const docRef = doc(db, COLLECTION, DOC_ID);
  await setDoc(docRef, data);
}
