const embed = require("./core/embed");
const { User, Match } = require("../models");

class join {
  constructor(db) {
    this.db = db;
    this.userModel = new User(db);
    this.matchModel = new Match(db);
  }

  async start(msg) {
    if (msg.author.bot === false) {
      let result = await this.userModel.getByDiscordId(msg.author.id);
      if (result === null) {
        msg.author.discordId = msg.author.id;
        msg.author.account = "player";
        let res = await this.userModel.setDiscordUser(msg.author);
      }
      let MID = msg.content.match(/[A-Z|0-9]\w+/g);
      const match = await this.matchModel.getByMID(MID);
      console.log("join!mid", MID);
      console.log("join!match", match);
      let player = {
        id: msg.author.id,
        username: msg.author.username,
        discriminator: msg.author.discriminator,
      };
      let join = await this.matchModel.joinMatch(MID[0], player);
      console.log("join!exe", join);
      let title = `Welcome to ${join.match.name}`;
      let description,
        or_description = "";
      if (join.responce === false) {
        description = "You are already registered for the match";
        or_description = `@${msg.author.username}  doesn't know he's already registered?`;
      } else {
        description = "welcome to match";
        or_description = `@${msg.author.username} registered in the match with success`;
      }
      let color = "invite";
      return {
        responce: embed.sms(
          { name: "\u200B", value: "\u200B" },
          title,
          description,
          color
        ),
        organizer: {
          to: join.match.organizer,
          responce: embed.sms(
            { name: "\u200B", value: "\u200B" },
            `Notification - ${join.match.name} ${join.match.MID}`,
            or_description,
            color
          ),
        },
      };
    }
  }
}

module.exports = join;
