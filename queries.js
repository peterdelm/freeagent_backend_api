//Move this to a separate file with restrictive permissions

const Pool = require("pg").Pool;
const pool = new Pool({
  user: "peter",
  host: "localhost",
  database: "freeagent_database",
  password: "sudo",
  port: 5432,
});

const createGame = (request, response) => {
  const {
    location,
    date,
    time,
    game_length,
    calibre,
    game_type,
    gender,
    team_name,
    additional_info,
  } = request.body;

  pool.query(
    "INSERT INTO games (location, date, time, game_length, calibre, game_type, gender, team_name, additional_info ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
    [
      location,
      date,
      time,
      game_length,
      calibre,
      game_type,
      gender,
      team_name,
      additional_info,
    ],
    (error, results) => {
      if (error) {
        throw error;
      }
      console.log("Game Created");
      response.status(201);
    }
  );
};

const updateGame = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;

  pool.query(
    "UPDATE games SET name = $1, email = $2 WHERE id = $3",
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Game modified with ID: ${id}`);
    }
  );
};

const getGames = (request, response) => {
  pool.query("SELECT * FROM games ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

module.exports = {
  createGame,
  updateGame,
  getGames,
};
