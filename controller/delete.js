const { Match } = require("../models");
const embed = require("./core/embed");

class delet {
  constructor(db) {
    this.db = db;
    this.matchModule = new Match(db);
  }

  async start(msg) {
    let MID = msg.content.match(/[A-Z|0-9]\w+/g);
    var match = await this.matchModule.getByMID(MID[0]);
    var players = [];
    var title,
      organizer = msg.author,
      description = "";
    //console.log(match)
    if (match !== null && organizer.id === match.organizer.id) {
      organizer = match.organizer;
      title = `Notification - ${match.name} ${match.MID}`;
      description = `The match was canceled`;
      players = match.players;
      await this.matchModule.deleteMatch(MID[0]);
    } else {
      title = `Notification - match ${MID[0]} !?`;
      description = `Your match doesn't exist`;
    }
    return {
      responce: {
        organizer: embed.sms(
          {
            name: "\u200B",
            value: "\u200B",
          },
          title,
          description,
          "invite"
        ),
        players: embed.sms(
          {
            name: "\u200B",
            value: "\u200B",
          },
          title,
          description,
          "invite"
        ),
      },
      users: {
        organizer,
        players,
      },
    };
  }
}

module.exports = delet;
