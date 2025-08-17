
import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { ServiceAccount } from 'firebase-admin';

const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;

const getServiceAccount = (): ServiceAccount | undefined => {
  if (!serviceAccountString) {
    console.error('FIREBASE_SERVICE_ACCOUNT environment variable is not set.');
    return undefined;
  }
  try {
    return JSON.parse(serviceAccountString);
  } catch (e) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT:', e);
    return undefined;
  }
};

let app: App;
if (getApps().length === 0) {
  const serviceAccount = getServiceAccount();
  
  // This check is crucial. We only initialize if we have a valid service account.
  if (serviceAccount) {
    app = initializeApp({ 
      credential: cert(serviceAccount) 
    });
  } else {
    // If no service account, we can't proceed.
    // In a real production environment, you might handle this differently,
    // but for this context, throwing an error is appropriate.
    throw new Error("Firebase Admin SDK initialization failed: Service Account credentials are not available.");
  }

} else {
  app = getApps()[0];
}

export const db = getFirestore(app);
