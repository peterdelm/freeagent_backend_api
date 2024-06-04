const jwt = require("jsonwebtoken");
const dbConfig = require("../config/db.config.js");

const authenticateUserToken = (req, res, next) => {
  const secretKey = dbConfig.SECRET_KEY;

  console.log("Authenticating User Token...");

  if (!req.headers.authorization) {
    console.log("Authorization header is missing");
    return res.status(401).send("Authorization header is missing");
  }

  const token = req.headers.authorization.replace("Bearer ", "");

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.log("Invalid or expired token:", err.message);
      return res.status(401).send("Invalid or expired token");
    }

    req.user = decoded;
    console.log(
      "Access Token Authenticated Successfully. User logged in as: ",
      req.user.userID
    );
    console.log(
      "Access Token Authenticated Successfully. User logged in as: ",
      token
    );

    next();
  });
};

module.exports = authenticateUserToken;
