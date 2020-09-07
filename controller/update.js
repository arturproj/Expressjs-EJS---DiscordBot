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
class update {
  constructor(db) {
    this.db = db;
  }

  async start(msg) {
    let responce, color;

    const userModel = new User(this.db);
    const loggerModel = new Logger(this.db);
    const matchModel = new Match(this.db);
    let MID = msg.content.match(/[A-Z|0-9]\w+/g);
    let query = msg.content.match(/([a-zA-Z])\w+=[\s\S]*$/g);
    MID = MID[0];
    query = query !== null ? query[0].split("=") : null;
    console.log("UPDATE", MID, query);
    console.log("UPDATE", MID, new Date(query));

    try {
      const user = await userModel.getByDiscordId(msg.author.id);
      const match = await matchModel.getByMID(MID);
      //   console.log("user", user);
      //   console.log("match", match);
      let title = "UPDATE MID : " + MID;
      let description = "";
      color = "warning";
      if (query === null) {
        title = "UPDATE : " + match.name;
        color = "info";
        responce = [
          { name: "match id (**MID**)", value: match.MID, inline: true },
          {
            name: "organizer",
            value: match.organizer.username,
            inline: true,
          },
          { name: "\u200B", value: "\u200B" },
          {
            name: "date",
            value: match.date === "" ? "____" : match.date,
            inline: true,
          },
          {
            name: "city",
            value: match.city === "" ? "____" : match.city,
            inline: true,
          },
          { name: "\u200B", value: "\u200B" },
          { name: "level", value: match.level, inline: true },
          { name: "gender", value: match.gender, inline: true },
        ];

        return await embed.poll(
          match,
          responce,
          msg,
          title,
          description,
          ["Tutorial update match", "View match"],
          0,
          "next"
        );
      } else if (query !== null) {
        title = "UPDATE : " + match.name;

        if (
          user.account === "organizer" &&
          user.username === match.organizer.username
        ) {
          let indexQ = query[0],
            valueQ = query[1];
          console.log({ MID: MID }, { [indexQ]: valueQ });
          let m_update = await matchModel.updateMatch(
            { MID: MID },
            { [indexQ]: valueQ }
          );
          responce = [
            {
              name: m_update.responce,
              value: "\u200B",
            },
          ];
          color = "success";
        } else {
          responce = {
            name: "Sorry, you are not an organizer!",
            value: "\u200B",
          };
          color = "danger";
        }
        await msg.channel.send(embed.sms(responce, title, description, color));
        return await msg.channel.send(`!update ${MID}`);
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

module.exports = update;
