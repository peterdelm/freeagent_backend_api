const db = require("../models");
const User = db.users;
const Player = db.players;
const crypto = require("crypto");
const dbConfig = require("../config/db.config.js");

const jwt = require("jsonwebtoken");
require("dotenv").config();
const passwordResetMailer = require("./nodemailer.helper.js");
const userModel = require("../models/user.model.js");

//generate a secure JWT (JSON Web Token)
const generateTokens = async (userId) => {
  console.log("generateTokens called for User with ID: ", userId);

  try {
    const secretKey = dbConfig.SECRET_KEY;
    const refreshSecretKey = dbConfig.REFRESH_SECRET;

    // Access token expires in 1 hour
    const accessToken = jwt.sign({ userID: userId }, secretKey, {
      expiresIn: "1h",
    });

    // Refresh token expires in 7 days
    const refreshToken = jwt.sign({ userID: userId }, refreshSecretKey, {
      expiresIn: "7d",
    });

    await User.update(
      { refreshToken: refreshToken },
      { where: { id: userId } }
    );

    console.log("Freshly generated refreshToken is :", refreshToken);
    return { accessToken, refreshToken };
  } catch (error) {
    console.log("There was an error while generating the token");
  }
};

exports.refreshToken = (req, res) => {
  console.log("Refreshing AuthToken in refreshToken...");
  const secretKey = process.env.SECRET_KEY;
  const refreshSecretKey = dbConfig.REFRESH_SECRET;

  // Extract the token from the authorization header
  const jwtFromHeader =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  // console.log("jwtFromHeader in function refreshToken is: ", jwtFromHeader);
  if (!jwtFromHeader) {
    console.log(
      "Authorization header is missing or malformed in function refreshToken"
    );
    return res.status(401).send("Authorization header is missing or malformed");
  }

  jwt.verify(jwtFromHeader, refreshSecretKey, (err, decoded) => {
    if (err) {
      console.log("refreshSecretKey key is", refreshSecretKey);
      console.log("Invalid or expired refresh token in function refreshToken");
      return res.status(403).send("Invalid or expired refresh token");
    }

    // Generate a new token
    console.log(
      "RefreshToken passed verification. Generating new Access Token..."
    );

    const newToken = jwt.sign({ userID: decoded.userID }, secretKey, {
      expiresIn: "24h",
    });

    // Respond with the new token
    res.json({
      token: newToken,
      user: { userId: decoded.userID, currentRole: decoded.currentRole },
    });
  });
};

// Retrieve all Users from the database.

exports.findAll = (req, res) => {
  User.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.login = async (req, res) => {
  try {
    // Find the user by email
    const user = await User.findOne({
      where: { email: req.body.emailAddress },
    });

    if (user === null) {
      res.status(401).send({
        error: "User not found",
      });
      console.log("Not found!");
    } else {
      if (req.body.password === user.password) {
        const token = await generateTokens(user.id);

        const userData = { userId: user.id, currentRole: user.currentRole };

        res.status(200).send({
          user: userData,
          success: true,
          token: token,
        });
      } else {
        res.status(401).send({
          error: "Incorrect username/password",
        });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
};

// Find a single Game with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  update;
  Game.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Game with id=" + id,
      });
    });
};

// Create and Save a new User
exports.create = async (req, res) => {
  try {
    console.log("A 'Create User' request has arrived");
    const { firstName, lastName, emailAddress, password } = req.body;

    // Validate request
    if (!firstName || !lastName || !emailAddress || !password) {
      console.log("Some fields are empty");
      res.status(400).send({
        message:
          "All fields (firstName, lastName, emailAddress, password) are required!",
      });
      return;
    }

    const user = {
      firstName: firstName,
      lastName: lastName,
      email: emailAddress,
      password: password,
    };

    const [result, created] = await User.findOrCreate({
      where: { email: user.email },
      defaults: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        isActive: true,
        currentRole: "manager",
      },
    });

    console.log("Result.created is " + created);
    console.log("Result.email is " + result.email);

    if (result.email === user.email) {
      if (created) {
        console.log("Result is " + result.id);
        const token = await generateToken(result.id);
        console.log("Token at line 165 is : " + token);
        res.status(200).send({
          success: true,
          token: token,
        });
      } else {
        console.log("Failure while creating an account");
        console.log("User with email " + user.email + " already exists.");
        res.status(409).send({
          success: false,
          message: "A user with that email already exists.",
        });
      }
    } else {
      console.log("Failure while creating an account");
    }
  } catch (err) {
    console.log("Problem with request");
    console.error("Error details:", err);
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Game.",
    });
  }
};

exports.getCurrentUser = async (req, res) => {
  console.log("getCurrentUser has been called");
  const userId = req.user.userID;

  try {
    const user = await User.findByPk(userId);
    const players = await user.getPlayers();
    const playerIds = players.map((player) => player.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    } else {
      return res.json({
        id: user.id,
        success: true,
        currentRole: user.currentRole,
        isActive: user.isActive,
        playerIds: playerIds,
      });
    }
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.switchProfile = async (req, res) => {
  const userId = await authenticateUserToken(req);

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const prevProfile = user.currentRole;

    if (prevProfile === "manager" || prevProfile === "player") {
      console.log("A switchProfile request has been received");

      const newProfile = prevProfile === "manager" ? "player" : "manager";
      await User.update({ currentRole: newProfile }, { where: { id: userId } });

      return res.json({ success: true, newProfile });
    } else {
      console.log("ERROR: toggleProfile request not sent");
      console.log(prevProfile);

      // Return the current profile to maintain the state
      return res.json({ success: false, currentProfile: prevProfile });
    }
  } catch (error) {
    console.error("Error in switchProfile: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const resetPasswordIfEmailFound = async (emailAddress) => {
  // Find the user by email
  const user = await User.findOne({
    where: { email: emailAddress },
  });
  if (user) {
    console.log("User found with email " + emailAddress);
    const token = await generateToken(user.id);

    passwordResetMailer.sendPasswordResetEmail(emailAddress, token);
  } else {
    console.log("User not found");
  }
};

exports.resetPassword = async (req, res) => {
  try {
    console.log(
      "resetPassword request received with email:" + req.body.emailAddress
    );
    resetPasswordIfEmailFound(req.body.emailAddress);
    return res.json({
      status: 200,
      message: "We have sent a reset link to your email",
    });
  } catch {
    console.error("Error in resetPassword:", error);
  }
};

exports.setNewPassword = async (req, res) => {
  try {
    //check if the token is legit
    const userId = await authenticateUserToken(req);
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const userUpdate = await User.update(
      { password: req.body.newPassword },
      { where: { id: userId } }
    );
    return res.json({
      status: 200,
      message: "You have successfully changed your password.",
    });
  } catch {
    console.error("Error in resetPassword:", error);
  }
};

exports.togglePlayerStatus = async (req, res) => {
  const userId = await authenticateUserToken(req);
  console.log("togglePlayerStatus called");

  // Find the user
  const user = await User.findByPk(userId, {
    include: [{ model: Player, as: "Players" }],
  });

  const prevProfile = user.isActive;
  try {
    if (prevProfile === true || prevProfile === false) {
      console.log("A togglePlayerStatus request has been received");
      console.log("prevProfile is ", prevProfile);

      const newProfile = prevProfile === true ? false : true;
      await User.update({ isActive: newProfile }, { where: { id: userId } });

      const playerProfiles = await user.getPlayers();
      console.log(playerProfiles);

      // Update all associated players' isActive to true
      await Promise.all(
        playerProfiles.map(async (player) => {
          await player.update({ isActive: newProfile });
        })
      );

      return res.json({ success: true, newProfile });
    } else {
      console.log("ERROR: toggleProfile request not sent");
      console.log(prevProfile);

      // Return the current profile to maintain the state
      return res.json({ success: false, currentProfile: prevProfile });
    }
  } catch (error) {
    console.error("Error in switchProfile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updatePushToken = async (req, res) => {
  console.log("updatePushToken called");

  const { userId, expoPushToken } = req.body;
  console.log("expoPushToken is", expoPushToken);

  try {
    await User.update({ pushToken: expoPushToken }, { where: { id: userId } });
    return res.json({ success: true, message: "updatePushToken called" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
