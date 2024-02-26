const db = require("../models");
const User = db.users;
const jwt = require("jsonwebtoken");
require("dotenv").config();
const passwordResetMailer = require("./nodemailer.helper.js");

const authenticateUserToken = async (req) => {
  const jwt = require("jsonwebtoken");
  const secretKey = process.env.SECRET;
  //FIND THE ID of the User
  try {
    // Ensure that the authorization header exists
    if (!req.headers.authorization) {
      console.log("Authorization header is missing");
      return null;
    }

    // Extract the token from the authorization header
    const jwtFromHeader = req.headers.authorization.replace("Bearer ", "");

    // Decode and verify the JWT
    const decoded = await jwt.verify(jwtFromHeader, secretKey);

    // Extract the user ID from the decoded JWT payload
    const userId = decoded.userID;
    console.log("User ID is " + userId);

    return userId;
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return null;
  }
};
//generate a secure JWT (JSON Web Token)
const generateToken = async (userId) => {
  try {
    const secretKey = process.env.SECRET;
    console.log("generateToken called");
    console.log(userId);
    const payload = {
      userID: userId,
    };

    const token = await jwt.sign(payload, secretKey, { expiresIn: "24h" });
    console.log(token);
    return token;
  } catch (error) {
    console.log("There was an error while generating the token");
  }
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
        console.log(user.email); // 'My Title'

        const token = await generateToken(user.id);

        const userData = { userId: user.id, currentRole: user.currentRole };

        res.status(200).send({
          user: userData,
          success: true,
          token: token,
        });
      } else {
        console.log(user.email); // 'My Title'
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
  const userId = await authenticateUserToken(req);

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    } else {
      return res.json({ success: true, currentRole: user.currentRole });
    }
  } catch {
    console.error("Error in switchProfile:", error);
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
  } catch {
    console.error("Error in switchProfile:", error);
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

    passwordResetMailer.sendPasswordResetEmail(
      "peterdelmastro@hotmail.com",
      token
    );
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
      message: "You have changed your password.",
    });
  } catch {
    console.error("Error in resetPassword:", error);
  }
};
