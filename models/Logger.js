class Logger {
  constructor(db) {
    this.db = db.collection("logs_list");
  }

  async setLogs(index, discordId, type, responce, data_time = new Date()) {
    this.db.insertOne({
      index: index,
      user: discordId,
      type: type,
      responce: responce,
      date_time: data_time,
    });
  }
}

module.exports = Logger;
