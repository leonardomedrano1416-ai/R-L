const admin = require("firebase-admin");

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function sendTestNotification() {
  try {
    console.log("Looking for Leo's notification token...");

    const profilesSnapshot = await db.collection("profiles").get();

    let token = null;

    for (const profileDoc of profilesSnapshot.docs) {
      const data = profileDoc.data();

      if (data.person === "leo" && data.notificationTokens) {
        const tokenEntries = Object.values(data.notificationTokens);

        if (tokenEntries.length > 0) {
          token = tokenEntries[0].token;
          break;
        }
      }
    }

    if (!token) {
      throw new Error("No notification token found for Leo.");
    }

    const message = {
      token: token,

      notification: {
        title: "R&L ❤️",
        body: "Notifications are working! Leo & Rita are officially in sync. 🔔"
      },

      webpush: {
        notification: {
          title: "R&L ❤️",
          body: "Notifications are working! Leo & Rita are officially in sync. 🔔"
        }
      }
    };

    const response = await admin.messaging().send(message);

    console.log("Notification sent successfully!");
    console.log(response);

  } catch (error) {
    console.error("Notification failed:");
    console.error(error);
    process.exit(1);
  }
}

sendTestNotification();
