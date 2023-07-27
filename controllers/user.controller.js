const db = require("../models");
const User = db.users;
const jwt = require("jsonwebtoken");

//generate a secure JWT (JSON Web Token)
const generateToken = (user) => {
  
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

        res.status(200).send({
          token: "test123",
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
exports.create = (req, res) => {
  console.log("A 'Create User' request has arrived");

  console.log("Line 90: " + req.body.firstName);

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

  // Save User in the database
  const result = User.findOrCreate({
    where: { email: user.email },
    defaults: {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: user.password,
      is_active: true,
    },
  })
    .then((data) => {
      const response = {
        success: true, // Set the success property to true
        data: data, // Assign the created game object to the data property
        message: "Game Added",
      };
      res.status(200).send(response);
      console.log("User Added");
      console.log(result.email); // 'sdepold'
      console.log(user.last_name); // This may or may not be 'Technical Lead JavaScript'
      // console.log(created); // The boolean indicating whether this instance was just created
      // if (created) {
      //   console.log(user.last_name); // This will certainly be 'Technical Lead JavaScript'
      //   res.status(500).send({
      //     message: err.message || "This email already exists",
      //   });
      // }
    })
    .catch((err) => {
      console.log("Problem with request");
      console.log("err.name", err.name);
      console.log("err.message", err.message);
      console.log("err.errors", err.errors);
      // err.errors.map((e) => console.log(e.message)); // The name must contain between 2 and 100 characters.

      res.status(500).send({
        message: err.message || "Some error occurred while creating the Game.",
      });
    });
  return;
};
