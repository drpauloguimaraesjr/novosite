import * as admin from 'firebase-admin';

// Helper to clean environment variables that might have extra quotes from Vercel/Copy-paste
const cleanEnvVar = (val: string | undefined) => {
  if (!val) return undefined;
  return val.replace(/^["']|["']$/g, '').trim();
};

if (!admin.apps.length) {
  const projectId = cleanEnvVar(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  const clientEmail = cleanEnvVar(process.env.FIREBASE_CLIENT_EMAIL);
  let privateKey = cleanEnvVar(process.env.FIREBASE_PRIVATE_KEY);

  if (privateKey) {
    // Handle both literal newlines and escaped \n
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  if (!projectId || !clientEmail || !privateKey) {
    console.error("Firebase Admin Error: Missing environment variables:", {
      projectId: !!projectId,
      clientEmail: !!clientEmail,
      privateKey: !!privateKey
    });
  } else {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log("Firebase Admin initialized successfully.");
    } catch (error) {
      console.error("Firebase Admin initialization failed:", error);
    }
  }
}

const adminDb = admin.firestore();

export { adminDb };
