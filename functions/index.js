/**
 * `onDocumentCreated` trigger for /countries/{countryId}/cities/{cityId}
 * shows that the country document had NOT been created yet when the event
 * was triggered.
 *
 * Check logs at https://console.cloud.google.com/logs
 */

const assert = require("assert");
const {onDocumentCreated} = require("firebase-functions/v2/firestore"); // https://firebase.google.com/docs/functions/firestore-events?gen=2nd#writing-triggered_functions
// https://firebase.google.com/docs/functions/firestore-events?gen=2nd#data_outside_the_trigger_event
const {initializeApp, getApps} = require("firebase-admin/app");
const {getFirestore, DocumentReference} = require("firebase-admin/firestore");


// Initialize Cloud Firestore on Cloud Functions per https://firebase.google.com/docs/firestore/quickstart#initialize
if (!getApps().length) initializeApp(); // https://stackoverflow.com/questions/57763991/initializeapp-when-adding-firebase-to-app-and-to-server/57764002#57764002
const db = getFirestore();

exports.firestoreEventHander = onDocumentCreated(
    "countries/{countryId}/cities/{cityId}",
    async (event) => {
      console.log("onDocumentCreated called with", event);

      // Here, /countries/{countryId} should have been automatically created
      const snapshot = event.data; // not user-facing to log
      console.log("snapshot:", snapshot.data());
      console.log("snapshot exists:", snapshot.exists); // true

      const cityId = snapshot.id;
      console.log("cityId:", cityId);

      const countryRef = snapshot.ref.parent.parent; // not user-facing to log
      const countryId = countryRef.id;
      const countryPath = countryRef.path;
      console.log("countryId:", countryId);
      console.log("country path:", countryPath); // countries/USA

      // Assertions pass: ids from snapshot and parent path match event params
      assert(
          snapshot.id === event.params["cityId"],
          `snapshot (city) id should be ${event.params["cityId"]}`,
      );
      assert(
          snapshot.ref.parent.parent.id === event.params["countryId"],
          `countryId via grandparent should be ${event.params["countryId"]}`,
      );

      // Check if the countryRef is a valid DocumentReference
      assert(
          countryRef instanceof DocumentReference,
          "countryRef should be a DocumentReference",
      );
      // Check if the countryRef has the correct path
      assert(
          countryRef.path === `countries/${countryId}`,
          "countryRef has an incorrect path",
      );

      // Access snapshot through the db
      const cityDoc = await db.doc(`countries/${countryId}/cities/${cityId}`).get();
      console.log("cityDoc via db:", cityDoc.data());
      console.log("cityDoc.exists:", cityDoc.exists); // true

      // Check if the countryRef document exists
      const countryDoc = await countryRef.get();
      // debugger;
      console.log("countryDoc:", countryDoc.data());
      console.log("countryDoc.exists:", countryDoc.exists); // ⚠️ false ⚠️

      // Try to access the country via db.doc() -- https://firebase.google.com/docs/functions/firestore-events?gen=2nd#data_outside_the_trigger_event
      const countryDoc2 = await db.doc(`countries/${countryId}`).get();
      console.log("countryDoc2:", countryDoc2.data());
      console.log("countryDoc2.exists:", countryDoc2.exists); // ⚠️ false ⚠️
      // Might need to refresh https://console.cloud.google.com/logs/ or wait to see all log entries
    },
);
