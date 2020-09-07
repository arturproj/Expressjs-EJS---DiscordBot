const { User, Logger, Match } = require("../models");
const embed = require("./core/embed");

class leave {
  constructor(db) {
    this.db = db;
    this.matchModule = new Match(db);
  }

  async start(msg) {
    let MID = msg.content.match(/[A-Z|0-9]\w+/g);
    var match = await this.matchModule.getByMID(MID[0]);

    console.log("players1", match.players, match.players.length);
    var index = match.players.findIndex((ele) => {
      console.log(typeof ele.id, "|",typeof msg.author.id);
      return ele.id === msg.author.id;
    });
    console.log("index", index);
    if (index !== -1) {
      match.players.splice(index, 1);
      console.log("players2", match.players, match.players.length);
      let leave = await this.matchModule.updateMatch({ MID : MID[0] }, {players : match.players},true);
      console.log(leave);
    }
  }
}

module.exports = leave;
