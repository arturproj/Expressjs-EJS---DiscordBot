/**
 *  MongoClient.connect.client.db
 * @param {*} db
 *  Discord ID:String
 * @param {*} discordId
 *  Database users initialization
 * @param {*} userModel
 *  Database logs initialization
 * @param {*} loggerModel
 *
 * @getByMID
 * @return {*} {match}
 *
 * @setMatch
 * @return {*} ?
 */
class Matches {
  constructor(db) {
    this.db = db.collection("matches_list");
  }

  async getByMID(MID) {
    return this.db.findOne({ MID: MID });
  }
  async getAll() {
    return this.db.find({ _v: 0 }).toArray();
  }
  async getAllByUserId() {
    return this.db.find({ _v: 0 });
  }
  async setMatch(match) {
    return this.db.insertOne({
      MID: match.MID,
      name: match.name,
      created: match.created,
      organizer: match.organizer,
      players: [match.organizer],
      city: "",
      level: 1,
      gender: "mixed",
      date: `${new Date().getDate()}-${new Date().getMonth()}-${
        new Date().getFullYear() + 1
      } 10:30 AM`,
      _v: 0,
    });
  }
  async updateMatch(query, values, exck = false) {
    var resp = { responce: "Match updated successfully", status: true };
    let valid = Object.keys(values);
    if (
      (valid.includes("MID") ||
        valid.includes("created") ||
        valid.includes("organizer") ||
        valid.includes("players")) &&
      exck === false
    ) {
      resp = {
        responce: "Forbidden to update selected parameter",
        status: false,
      };
    }
    if ("level" in values && (1 > values.level || values.level > 10)) {
      resp = { responce: "Invalid match level", status: false };
    }
    if (
      "gender" in values &&
      ["mixed", "male", "female"].includes(values.gender) === false
    ) {
      resp = { responce: "Invalid match gender", status: false };
    }

    if ("date" in values) {
      let date = new Date(values.date);
      console.log("date", date.toJSON());
      if (date.toJSON() === null) {
        resp = { responce: "Invalid match date", status: false };
      }
    }
    if (resp.status === true) {
      values = { $set: values };
      let res = this.db.updateOne(query, values);
    }
    //return res;
    return resp;
  }

  async joinMatch(MID, values, query = { MID: MID }) {
    console.log(MID, values, query);
    const match = await this.getByMID(MID);
    console.log("joinMatch", match);
    const inMatch = (element) => element.id === values.id;
    let index = match.players.findIndex(inMatch);
    let responce = false;
    console.log(index);
    if (index === -1) {
      match.players.push(values);
      values = { $set: { players: match.players } };
      responce = this.db.updateOne(query, values);
    }
    return { responce: responce, match: match };
  }
  async deleteMatch(MID, query = { MID: MID }) {
    this.db.deleteOne(query);
  }
}

module.exports = Matches;
