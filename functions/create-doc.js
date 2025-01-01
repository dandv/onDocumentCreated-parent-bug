/**
 * @file Create a document under /countries/{countryId}/cities/{cityId}
 * to trigger the `firestoreEventHandler` in `functions/index.js`.
 *
 * Requires obtaining a service account key from https://console.cloud.google.com/iam-admin/serviceaccounts.
 */
const {initializeApp, cert} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

// Initialize Cloud Firestore per https://firebase.google.com/docs/firestore/quickstart#initialize
const serviceAccount = "onDocumentCreated-bug-service-account.json";
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

/**
 * @param {string} countryId
 * @param {string} cityId
 */
(async function main() {
  // Create a document under the /countries/{countryId}/cities/{cityId} path.
  const cityRef =
    db.collection("countries").doc("USA").collection("cities").doc("SF");
  console.log("Creating document under /countries/USA/cities/SF...");
  await cityRef.set({name: "San Francisco", pop: 801500});
  console.log("Done.");
  // Check https://console.firebase.google.com/u/0/project/ondocumentcreated-bug/firestore
})();
