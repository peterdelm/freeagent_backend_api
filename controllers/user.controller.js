const db = require("../models");
const User = db.users;

// Retrieve all Sports from the database.

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

exports.login = (req, res) => {
  //find the user by email
  const user = User.findOne({ where: { email: req.body.email } });
  if (user === null) {
    console.log("Not found!");
  } else {
    console.log(user instanceof User); // true
    console.log(user.email); // 'My Title'
    console.log(user.password); // 'My Title'
  }
  //compare password
  //SUCCESS: send token
  //FAILURE: send failure notice
  console.log(req.body);
  res.send({
    token: "test123",
  });
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
  console.log(req.body.first_name);

  const user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    address: req.body.address,
    birthdate: req.body.birthdate,
    password: req.body.password,
  };

  // Validate request
  if (!req.body.email) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  // Save User in the database
  const [result, created] = User.findOrCreate({
    where: { email: user.email },
    defaults: {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      address: user.address,
      birthdate: user.birthdate,
      password: user.password,
    },
  })
    .then((data) => {
      res.send(data);
      console.log("User Added");
      console.log(result.email); // 'sdepold'
      console.log(user.last_name); // This may or may not be 'Technical Lead JavaScript'
      console.log(created); // The boolean indicating whether this instance was just created
      if (created) {
        console.log(user.last_name); // This will certainly be 'Technical Lead JavaScript'
        res.status(500).send({
          message: err.message || "This email already exists",
        });
      }
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
