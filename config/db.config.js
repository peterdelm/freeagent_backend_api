module.exports = {
  HOST: "localhost",
  USER: "postgres",
  PASSWORD: "sudo",
  DB: "freeagent_database",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
