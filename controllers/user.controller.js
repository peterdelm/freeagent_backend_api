const db = require("../models");
const User = db.users;
const jwt = require("jsonwebtoken");
require("dotenv").config();

//generate a secure JWT (JSON Web Token)
const generateToken = (userId) => {
  const secretKey = process.env.SECRET;
  console.log("generateToken called");
  console.log(userId);
  const payload = {
    userID: userId,
  };

  const token = jwt.sign(payload, secretKey, { expiresIn: "24h" });
  console.log(token);
  return token;
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

exports.retrieveToken = (req, res) => {
  console.log("RetrieveUserToken Request Received");

  res.send({
    token: "test123",
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
        console.log(typeof req.body.password);
        console.log(user instanceof User); // true
        console.log(user.email); // 'My Title'
        console.log(typeof user.password); // 'My Title'
        const token = generateToken(user.id);

        res.status(200).send({
          token: token,
        });
      } else {
        console.log(typeof req.body.password);
        console.log(user instanceof User); // true
        console.log(user.email); // 'My Title'
        console.log(typeof user.password); // 'My Title'
        res.status(401).send({
          error: "Incorrect username/password",
        });
      }
    }
  } catch (err) {
    // Handle any errors that occur during the asynchronous operation
    console.error(err);
    res.status(500).send({
      error: "Internal Server Error",
    });
  }

  // Other code for password comparison and token generation should be added here
  // ...
};

// Find a single Game with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

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
  console.log("A 'Create User' request has arrived");
  const { firstName, lastName, emailAddress, password } = req.body;

  // Validate request
  if (!firstName || !lastName || !emailAddress || !password) {
    console.log("Some fields are empty");

    res.status(400).send({
      message: "All fields are required!",
    });
    return;
  }

  const user = {
    first_name: firstName,
    last_name: lastName,
    email: emailAddress,
    password: password,
  };

  try {
    const [result, created] = await User.findOrCreate({
      where: { email: user.email },
      defaults: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: user.password,
        is_active: true,
      },
    });
    console.log("Result.created is " + created);
    console.log("Result.email is " + result.email);
    if (result.email === user.email)
      if (created) {
        console.log("Result is " + result.id);

        const token = generateToken(result.id);
        res.status(200).send({
          success: true,
          token: token,
        });

        console.log("Line 90: " + req.body.firstName);
        console.log("req.body is " + req.body);
        console.log("req.headers is " + req.headers);
        console.log("req.body.firstName is " + req.body.firstName);
      } else {
        console.log("Failure while creating an account");
        console.log("User with email " + user.email + " already exists.");
        res.status(401).send({
          success: false,
          message: "A user with that email already exists.",
        });
      }
    else {
      console.log("Failure while creating an account");
    }
  } catch (err) {
    console.log("Problem with request");
    console.log("err.name", err.name);
    console.log("err.message", err.message);
    console.log("err.errors", err.errors);
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Game.",
    });
  }

  return;
};
