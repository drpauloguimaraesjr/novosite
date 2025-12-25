import * as admin from 'firebase-admin';

// Helper to clean environment variables that might have extra quotes
const cleanEnvVar = (val: string | undefined) => {
  if (!val) return undefined;
  return val.replace(/^["']|["']$/g, '').trim();
};

// Lazy initialization - only initialize when actually needed (not during build)
let adminApp: admin.app.App | null = null;
let adminDbInstance: admin.firestore.Firestore | null = null;

function getAdminApp(): admin.app.App | null {
  // Skip initialization during build time
  if (typeof window !== 'undefined') {
    return null; // Client-side, return null
  }

  if (adminApp) {
    return adminApp;
  }

  if (admin.apps.length > 0) {
    adminApp = admin.apps[0]!;
    return adminApp;
  }

  const projectId = cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  const clientEmail = cleanEnvVar(process.env.FIREBASE_CLIENT_EMAIL);
  let privateKey = cleanEnvVar(process.env.FIREBASE_PRIVATE_KEY);

  if (privateKey) {
    // Handle both literal newlines and escaped \n
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  if (!projectId || !clientEmail || !privateKey) {
    // During build, env vars won't be available - this is expected
    if (process.env.NODE_ENV === 'production' && !process.env.FIREBASE_CLIENT_EMAIL) {
      console.log("[Firebase Admin] Skipping initialization during build (no env vars)");
      return null;
    }
    console.error("Firebase Admin Error: Missing environment variables:", {
      projectId: !!projectId,
      clientEmail: !!clientEmail,
      privateKey: !!privateKey
    });
    return null;
  }

  try {
    adminApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    console.log("Firebase Admin initialized successfully.");
    return adminApp;
  } catch (error) {
    console.error("Firebase Admin initialization failed:", error);
    return null;
  }
}

// Lazy getter for Firestore
function getAdminDb(): admin.firestore.Firestore | null {
  if (adminDbInstance) {
    return adminDbInstance;
  }

  const app = getAdminApp();
  if (!app) {
    return null;
  }

  adminDbInstance = admin.firestore();
  return adminDbInstance;
}

// Export a proxy object that lazily initializes
export const adminDb = new Proxy({} as admin.firestore.Firestore, {
  get(target, prop) {
    const db = getAdminDb();
    if (!db) {
      throw new Error("Firebase Admin not initialized. Check environment variables.");
    }
    return (db as any)[prop];
  }
});

export { getAdminApp, getAdminDb };
