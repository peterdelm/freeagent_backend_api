const dbConfig = require("../config/db.config.js");
require("pg");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  logging: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.games = require("./game.model.js")(sequelize, Sequelize);
db.players = require("./player.model.js")(sequelize, Sequelize);
db.sports = require("./sport.model.js")(sequelize, Sequelize);
db.users = require("./user.model.js")(sequelize, Sequelize);
db.invites = require("./invite.model.js")(sequelize, Sequelize);
db.conversations = require("./conversation.model.js")(sequelize, Sequelize);
db.participants = require("./participant.model.js")(sequelize, Sequelize);
db.messages = require("./message.model.js")(sequelize, Sequelize);
db.tasks = require("./task.model.js")(sequelize, Sequelize);
db.locations = require("./location.model.js")(sequelize, Sequelize);

db.players.belongsTo(db.users, { foreignKey: "userId" });
db.players.hasMany(db.invites, { foreignKey: "playerId" });

db.games.belongsTo(db.users, { foreignKey: "userId" });
db.games.hasMany(db.invites, { foreignKey: "gameId" });
db.games.hasOne(db.locations, { foreignKey: "gameId" });

db.invites.belongsTo(db.games, { foreignKey: "gameId" });
db.invites.belongsTo(db.players, { foreignKey: "playerId" });

db.users.hasMany(db.players, { foreignKey: "userId" });
db.users.belongsToMany(db.conversations, {
  through: db.participants,
  foreignKey: "userId",
  otherKey: "conversationId",
});

db.conversations.hasMany(db.participants, { foreignKey: "conversationId" });
db.conversations.belongsToMany(db.users, {
  through: db.participants,
  foreignKey: "conversationId",
  otherKey: "userId",
});

db.participants.belongsTo(db.users, { foreignKey: "userId" });
db.participants.belongsTo(db.conversations, {
  foreignKey: "conversationId",
});

module.exports = db;
