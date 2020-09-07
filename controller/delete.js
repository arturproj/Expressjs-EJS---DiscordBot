const { User, Logger, Match } = require("../models");
const embed = require("./core/embed");

class Delete {
  constructor(db) {
    this.db = db;
    this.matchModule = new Match(db);
  }

  async start(msg) {
    let MID = msg.content.match(/[A-Z|0-9]\w+/g);
    var match = await this.matchModule.getByMID(MID[0]);
    await this.matchModule.deleteMatch(MID[0]);
    var players = match.players;
    const inMatch = (element) => element.id === msg.author.id;
    let index = players.findIndex(inMatch);
    players.splice(index, 1);
    // console.log("index",index);
    // console.log(players);
    const values = {};
    if (match.organizer.id === msg.author.id && players.length > 0) {
      match.organizer = players[0];
    }
    match.players = [...players];
    // console.log(query);
    // console.log(values);
    let res = await this.matchModule.regenMatch(match);
    // console.log("result",res.result)
    // console.log(match);
  }
}

module.exports = Delete;
