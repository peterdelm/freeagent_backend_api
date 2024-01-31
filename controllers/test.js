const userId = "8e2d5af2-3883-4649-a41c-e67b7f59deea";
const db = require("../models");
const User = db.users;
const Conversation = db.conversations;
const Participant = db.participants;

const run_test = async () => {
  const user = await User.findByPk(userId);
  console.log("User is named " + user);
  const conversation = await Conversation.create({ userId: userId });
  user.addConversation(conversation);
  console.log("User is named " + user.conversations);

  // Query to find conversations connected to the user
  Conversation.findAll({
    include: [
      {
        model: Participant,
        where: {
          userId: userId,
        },
      },
    ],
  })
    .then((conversations) => {
      // If conversations array is not empty, the user is connected to those conversations
      if (conversations.length > 0) {
        console.log(
          `User with ID ${userId} is connected to the following conversations:`
        );
        conversations.forEach((conversation) => {
          console.log(`- Conversation ID: ${conversation.id}`);
        });
      } else {
        console.log(
          `User with ID ${userId} is not connected to any conversations.`
        );
      }
    })
    .catch((error) => {
      console.error("Error finding connected conversations:", error);
    });
};

run_test();
