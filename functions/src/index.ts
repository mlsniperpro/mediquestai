import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
admin.initializeApp();

// Example HTTP Cloud Function
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

// Example Firestore trigger
export const onUserCreate = functions.firestore
  .document("users/{userId}")
  .onCreate((snap, context) => {
    const newValue = snap.data();
    const userId = context.params.userId;
    
    functions.logger.info(`New user created: ${userId}`, newValue);
    
    // Example: Add a welcome message
    return admin.firestore().collection("messages").add({
      userId: userId,
      message: "Welcome to our app!",
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
  });

// Example scheduled function (runs every day at midnight)
export const dailyCleanup = functions.pubsub
  .schedule("0 0 * * *")
  .timeZone("America/New_York")
  .onRun((context) => {
    functions.logger.info("Running daily cleanup");
    // Add your cleanup logic here
    return null;
  });