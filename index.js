const db = require("./queries");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.get("/games", db.getGames);
app.post("/games", db.createGame);
app.put("/games/:id", db.updateGame);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
