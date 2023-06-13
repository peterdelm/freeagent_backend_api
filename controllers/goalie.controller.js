const db = require("../models");
const Goalie = db.goalies;
const Op = db.Sequelize.Op;

// Create and Save a new Goalie
exports.create = (req, res) => {
  console.log("A request has arrived");
  // Validate request
  if (!req.body.address) {
    res.status(400).send({
      message: "address can not be empty!",
    });
    return;
  }

  // Create a Goalie
  const goalie = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    address: req.body.address,
    gender: req.body.gender,
    birthdate: req.body.birthdate,
    years_played: req.body.years_played,
    personal_calibre: req.body.personal_calibre,
    desired_calibre: req.body.desired_calibre,
    travel_range: req.body.travel_range,
    game_types: req.body.game_types,
    bio: req.body.bio,
  };

  // Save Goalie in the database
  Goalie.create(goalie)
    .then((data) => {
      res.send(data);
      console.log("Goalie Added");
    })
    .catch((err) => {
      console.log("Problem with request");
      console.log("err.name", err.name);
      console.log("err.message", err.message);
      console.log("err.errors", err.errors);
      //   err.errors.map((e) => console.log(e.message)); // The name must contain between 2 and 100 characters.

      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Goalie.",
      });
    });
};

// Retrieve all Goalies from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

  Goalie.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving goalies.",
      });
    });
};

// Find a single Goalie with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Goalie.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Goalie with id=" + id,
      });
    });
};

// Update a Goalie by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Goalie.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Goalie was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Goalie with id=${id}. Maybe Goalie was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Goalie with id=" + id,
      });
    });
};

// Delete a Goalie with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Goalie.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Goalie was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Goalie with id=${id}. Maybe Goalie was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Goalie with id=" + id,
      });
    });
};

// Delete all Goalies from the database.
exports.deleteAll = (req, res) => {
  Goalies.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Goalies were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Goalies.",
      });
    });
};

// find all published Goalie
exports.findAllPublished = (req, res) => {
  Goalie.findAll({ where: { published: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Goalies.",
      });
    });
};
