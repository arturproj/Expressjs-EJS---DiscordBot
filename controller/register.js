const embed = require("./core/embed");

const { User, Logger } = require("../models");

/**
 *  MongoClient.connect.client.db
 * @param {*} db
 *  Discord author:obj
 * @param {*} user
 *  Database users initialization
 * @param {*} userModel
 *  Database logs initialization
 * @param {*} loggerModel
 *
 * @return {*} embedMessage
 */
class register {
  constructor(db) {
    this.db = db;
  }

  async start(user) {
    var responce;

    const userModel = new User(this.db);
    const loggerModel = new Logger(this.db);
    const skills = user.content.split(" ");
    user.author.account =
      skills.length > 1 &&
      (skills[1] === "organizer" ||
        skills[1] === "player" ||
        skills[1] === "viewer")
        ? skills[1]
        : "viewer";
    user.author.discordId = user.author.id;

    try {
      let result = await userModel.getByDiscordId(user.author.discordId);

      if (result === null) {
        let res = await userModel.setDiscordUser(user.author);
        console.log("setDiscordUser", res);
        // await loggerModel.setLogs(
        //   "_signup",
        //   user.author.discordId,
        //   "done",
        //   "create"
        // );
        responce = `Welcome ${user.author.username} !`;
      } else {
        // await loggerModel.setLogs(
        //   "_signup",
        //   user.author.discordId,
        //   "done",
        //   "ready"
        // );
        responce = "Hello, you are ready!";
      }

      return embed.sms({ name: responce, value: "\u200B" }, "**Signing up**",'','success');
    } catch (err) {
      console.error(err);
      await loggerModel.setLogs("_signup", user.author.discordId, "error", err);
      return embed.sms(
        "Sorry, encountered a problem. Try again!",
        "**Signing up**"
      );
    }
  }
}

module.exports = register;
