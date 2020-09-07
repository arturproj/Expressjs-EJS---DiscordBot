const MongoClient = require("mongodb").MongoClient;
const { DB_HOST, DB_NAME, DB_PORT } = process.env;
const url = `mongodb://${DB_HOST}:${DB_PORT}/`;

const connect = async () => {
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  db = client.db(DB_NAME);
  return db;
};

module.exports = connect;
