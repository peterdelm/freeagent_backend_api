const fetch = require("node-fetch");

async function sendPushNotification(expoPushToken, title, body, data = {}) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: title,
    body: body,
    data: data,
  };

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`Failed to send notification: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log("Notification sent successfully:", responseData);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}

module.exports = {
  sendPushNotification,
};

//get the token from the user.
