require("dotenv").config();
const connect = require("./db");

connect().then((db) => {
  require("./app")(db);
});
