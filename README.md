# onDocumentCreated bug

This repo demonstrates an issue with the `onDocumentCreated` Firestore trigger:
when `onDocumentCreated` is triggered for a nested document, the parent document
has not been created yet.

For example, when `onDocumentCreated` is triggered for `/countries/{countryId}/cities/{cityId}`,
the `/countries/{countryId}` document does not exist yet.

This is contrary to the documentation, which [states](https://firebase.google.com/docs/firestore/data-model):

> Collections and documents are created implicitly in Cloud Firestore.
> Simply assign data to a document within a collection.
> If either the collection or document does not exist, Cloud Firestore creates it.

The [Trigger a function when a new document is created](https://firebase.google.com/docs/functions/firestore-events?gen=2nd#trigger_a_function_when_a_new_document_is_created)
example doesn't mention anything about the parent document of newly created
nested documents not existing yet.

## Reproduction steps:

1. `git clone https://github.com/dandv/onDocumentCreated-parent-bug.git`
2. `cd onDocumentCreated-parent-bug`
3. `npm install`
4. `cd functions`
5. `npm deploy`
6. `node create-doc.js`
7. Check the logs at https://console.cloud.google.com/logs/query?project=ondocumentcreated-bug
8. Notice `countryDoc.exists: false`

Alternatively, run the emulator (`npm run dev`), debug `functions/indexjs` in your IDE,
and inspect the variables after the "debugger" statement.
