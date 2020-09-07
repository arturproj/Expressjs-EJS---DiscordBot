const embed = require("./core/embed");

const { User, Logger, Match } = require("../models");

/**
 *  MongoClient.connect.client.db
 * @param {*} db
 *  Discord:obj
 * @param {*} obj
 *  Database users initialization
 * @param {*} userModel
 *  Database logs initialization
 * @param {*} loggerModel
 *  Database match initialization
 * @param {*} matchModel
 *
 * @configMatch
 * @return {*} embed
 */
class invited {
  constructor(db) {
    this.db = db;
  }

  async start(bot, msg) {
    let responce, color;

    const userModel = new User(this.db);
    const loggerModel = new Logger(this.db);
    const matchModel = new Match(this.db);
    let MID = msg.content.match(/[A-Z|0-9]\w+/g);
    let query = msg.content.match(/([a-zA-Z])\w+=[\s\S]*$/g);
    MID = MID[0];
    query = query !== null ? query[0].split("=") : null;
    console.log("INVITE", MID, msg.content);
    const mention = msg.mentions.users.array() || new Array();

    try {
      const user = await userModel.getByDiscordId(msg.author.id);
      const match = await matchModel.getByMID(MID);
      //   console.log("user", user);
      //   console.log("match", match);
      let title = "UPDATE MID : " + MID;
      let description = "";
      color = "warning";
      if (mention.length === 0) {
        title = "INVITE : " + match.name;
        color = "info";
        responce = [
          { name: "match id (**MID**)", value: match.MID, inline: true },
          {
            name: "organizer",
            value: match.organizer.username,
            inline: true,
          },
        ];

        return await embed.poll(
          match,
          responce,
          msg,
          title,
          description,
          [
            "Tutorial invite match",
            //"Invite all guild users"
          ],
          0,
          "quest"
          //"next"
        );
      } else if (mention.length > 0) {
        title = "INVITE : " + match.name;
        let i = 0;
        description += `Invitation invited to playe${
          mention.length === 1 ? "r" : "rs"
        } : \n\n`;
        mention.forEach((element) => {
          if (element.bot === false) description += `<@${element.id}> \n`;
        });
        responce = [
          { name: "match id (**MID**)", value: match.MID, inline: true },
        ];
        color = "info";
        responce = [
          { name: "match id (**MID**)", value: match.MID, inline: true },
        ];
        msg.reply(embed.sms(responce, title, description, "invite"));
        mention.forEach((element) => {
          description =
            "You have been invited to join the match. will you come there?";
          if (element.bot === false) {
            return embed.invitation(
              match,
              responce,
              msg,
              title,
              description,
              [
                "invite accept",
                "invite decline",
                //"View match",
              ],
              0,
              "check",
              bot,
              element.id,
              this.db
            );
          }
        });
      } else if (user === null) {
        responce = {
          name: "Sorry, I don't know your account",
          value: "\u200B",
        };
      } else if (match === null) {
        responce = {
          name: "Sorry, I don't know your match",
          value: "\u200B",
        };
      }
      responce = {
        name: "Sorry, encountered a problem. Try again!",
        value: "\u200B",
      };
      return embed.sms(responce, title, description, color);
    } catch (err) {
      console.error(err);
      await loggerModel.setLogs("_create", msg.author.id, "error", err);
      return embed.sms(
        "Sorry, encountered a problem. Try again!",
        title,
        description,
        "danger"
      );
    }
  }
}

module.exports = invited;
