const { User, Logger } = require("../models");
const embed = require("./core/embed");
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
 * @return {*} Boolean
 */
class check {
  constructor(db) {
    this.db = db;
    this.userModel = new User(db);
    this.loggerModel = new Logger(db);
  }

  async start(discordId, source) {
    console.log("!ping", discordId);
    try {
      let responce,
        title = "**!PING state**",
        description = "view the account status",
        result = await this.userModel.getByDiscordId(discordId);
      console.log("userModel.getByDiscordId", result);
      if (result !== null) {
        responce = [
          { name: "username", value: result.username, inline: true },
          {
            name: "account",
            value: result.account,
          },
          {
            name: "created",
            value: `${result.created.getDate()}-${
              result.created.getMonth() + 1
            }-${result.created.getFullYear()} 
            ${result.created.getHours()}:${result.created.getMinutes()}`,
          },
          { name: "Your account is ready", value: "\u200B", inline: true },
        ];
      } else {
        responce = [
          { name: "Sorry, I don't know your account", value: "\u200B" },
          { name: "try !help", value: "\u200B" },
          {
            name: "try !signup <account>",
            value: "account : **organizer** | **player** | **viewer**",
          },
        ];
      }

      return {
        embed: {
          color: `#0099ff`,
          title,
          description,
          thumbnail: {
            url: source,
          },
          fields: [...responce],
          timestamp: new Date(),
          footer: {
            text: "RugbyBot",
            icon_url:
              "https://pbs.twimg.com/profile_images/1161547839765471232/Jhtsculz.jpg",
          },
        },
      };
    } catch (err) {
      console.error(err);
      await this.loggerModel.setLogs("_check", discordId, "error", err);
      return embed.sms(
        "Sorry, encountered a problem. Try again!",
        title,
        description,
        "danger"
      );
    }
  }
}

module.exports = check;
