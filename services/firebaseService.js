const { Expo } = require("expo-server-sdk");
const sendPushNotification = async (userPushTokens, title, body, data) => {
  let expo = new Expo({
    // accessToken: process.env.EXPO_ACCESS_TOKEN,
    useFcmV1: true, // this can be set to true in order to use the FCM v1 API
  });
  console.log("sendPushNotification called");
  let messages = [];

  for (let pushToken of userPushTokens) {
    // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
    console.log("Pushtoken in sendPush Notification is", pushToken);
    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }

    messages.push({
      to: pushToken,
      sound: "default",
      title: "Free Agent",
      body: "A Game Needs You!",
      data: { withSome: "data" },
    });
  }

  // The Expo push notification service accepts batches of notifications so
  // that you don't need to send 1000 requests to send 1000 notifications. We
  // recommend you batch your notifications to reduce the number of requests
  // and to compress them (notifications with similar content will get
  // compressed).
  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  (async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
      } catch (error) {
        console.error(error);
      }
    }
  })();

  try {
    // const response = await fetch("https://exp.host/--/api/v2/push/send", {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(message),
    // });
    // if (!response.ok) {
    //   throw new Error(`Failed to send notification: ${response.statusText}`);
    // }
    // expo.sendPushNotificationsAsync();
    // const responseData = await response.json();
    // console.log("Notification sent successfully:", responseData);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

module.exports = {
  sendPushNotification,
};

//get the token from the user.
