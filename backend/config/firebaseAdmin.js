const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const path = require("path");
const fs = require("fs");

let serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./config/firebase-service-account.json.json";
let resolvedPath = path.resolve(__dirname, "..", serviceAccountPath);

if (!fs.existsSync(resolvedPath)) {
  const altPath = path.resolve(__dirname, "firebase-service-account.json");
  if (fs.existsSync(altPath)) {
    resolvedPath = altPath;
  }
}

let app;
if (fs.existsSync(resolvedPath)) {
  const serviceAccount = require(resolvedPath);
  if (!getApps().length) {
    app = initializeApp({
      credential: cert(serviceAccount)
    });
    console.log("[✓] Firebase Admin initialized with service account");
  } else {
    app = getApps()[0];
  }
} else {
  console.warn(`[!] Warning: Firebase service account file not found at ${resolvedPath}`);
  if (!getApps().length) {
    app = initializeApp();
  } else {
    app = getApps()[0];
  }
}

const db = getFirestore();
const auth = getAuth();

module.exports = { admin: { auth: () => auth, firestore: () => db }, auth, db };
