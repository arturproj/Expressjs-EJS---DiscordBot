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
    let valid = Object.keys(values);
    if (
      (valid.includes("MID") ||
        valid.includes("created") ||
        valid.includes("organizer") ||
        valid.includes("players")) &&
      exck === false
    ) {
      return "Forbidden to update selected parameter";
    }
    values = { $set: values };
    let res = this.db.updateOne(query, values);
    return res;
    return "Match updated successfully";
  }

  async regenMatch(match) {    
    return this.db.insertOne(match)
  }

  async joinMatch(MID, values, query = { MID: MID }) {
    console.log(MID, values, query);
    const match = await this.getByMID(MID);
    console.log("joinMatch", match);
    match.players.push(values);
    //console.log(query);
    //console.log(match);
    //console.log(values);
    values = { $set: { players: match.players } };
    this.db.updateOne(query, values);
    return { responce: true, organizer: match.organizer, match: match };
  }
  async deleteMatch(MID,query = { MID: MID }) {    
    this.db.deleteOne(query);
  }
}

module.exports = Matches;
