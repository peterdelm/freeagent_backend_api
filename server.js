const express = require("express");
const cors = require("cors");
// const startWorker = require("./workers/findPlayer.worker.js"); // Import the worker module

const app = express();

var corsOptions = {
  origin: "https://165.227.42.133:3001/",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

//start workers

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Free Agent." });
});

require("./routes/game.routes")(app);
require("./routes/player.routes")(app);
require("./routes/sport.routes")(app);
require("./routes/user.routes")(app);
require("./routes/geocoding.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
