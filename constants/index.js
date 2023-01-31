require("dotenv").config();

/**@defining constants from @environment variables */
const APP_NODE_ENV = process.env.NODE_ENV;
const APP_PORT = process.env.PORT || 5000;
const APP_MONGO_URI = process.env.MONGO_URI;
const SECRET = process.env.JWT_SECRET;

//export constants
module.exports = {
  APP_NODE_ENV,
  APP_PORT,
  APP_MONGO_URI,
  SECRET,
};
