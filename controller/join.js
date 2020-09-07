const embed = require("./core/embed");
const { User, Logger, Match } = require("../models");

class join {
  constructor(db) {
    this.db = db;
  }

  async start(msg) {
    if (msg.author.bot === false) {
      const userModel = new User(this.db);
      const loggerModel = new Logger(this.db);
      const matchModel = new Match(this.db);

      let result = await userModel.getByDiscordId(msg.author.id);
      if (result === null) {
        let res = await userModel.setDiscordUser(msg.author);
      }
      let MID = msg.content.match(/[A-Z|0-9]\w+/g);
      const match = await matchModel.getByMID(MID);
      console.log("join!mid", MID);
      console.log("join!match", match);
      let player = {
        id: msg.author.id,
        username: msg.author.username,
        discriminator: msg.author.discriminator,
      };
      let join = await matchModel.joinMatch(MID[0], player);
      console.log("join!exe", join);
      let title = `Welcome to ${join.match.name}`;
      let description = "";
      let color = 'invite';
      return embed.sms(
        { name: "\u200B", value: "\u200B" },
        title,
        description,
        color
      );
    }
  }
}

module.exports = join;
