const express = require("express");
const cors = require("cors");
const path = require("path");
const startWorker = require("./workers/findPlayer.worker.js"); // Import the worker module

const app = express();

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Allow requests without an Origin header
//       if (!origin) {
//         callback(null, true);
//         console
//       } else {
//         // Check if the request comes from an allowed origin
//         const allowedOrigins = "*";
//         console.log("The incoming origin is :" + origin);
//         if (allowedOrigins.includes(origin)) {
//           callback(null, true);
//         } else {
//           callback(new Error("Not allowed by CORS"));
//         }
//       }
//     },
//     // Add any other relevant options
//   })
// );

// const corsOptions = {
//   origin: "*",
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };

app.use(cors("*"));

// parse requests of content-type - application/json
app.use(express.json());
//start workers

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

// drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

//start workers
startWorker().catch((error) => {
  console.error("Error in startWorker:", error);
});

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
