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
class match {
  constructor(db) {
    this.db = db;
  }

  async start(msg) {
    let responce, color;

    const userModel = new User(this.db);
    const loggerModel = new Logger(this.db);
    const matchModel = new Match(this.db);
    let MID = msg.content.match(/[A-Z|0-9]\w+/g);
    let query = msg.content.match(/([a-z])\w+=[\s\S]*$/g);
    query = query !== null ? query[0].split("=") : null;
    const user = await userModel.getByDiscordId(msg.author.id);

    // console.log("user", user);
    // console.log("match", match);
    try {
      
      let title = "Match MID : " + MID;
      let description = "";
      color = "warning";
      if (MID === null) {
        let matches = await matchModel.getAll();
        title = "Matches";
        matches.forEach((element) => {
          console.log(element.MID);
          description += `**${element.name}** ( *MID* **${element.MID}** ) : *${element.organizer.username}* \n\n`;
        });
        responce = [{ name: "Next step", value: `write !match MID`, inline: true },];
        color = "info";
        console.log(responce, title, description, color);
      } else if (MID !== null && query === null) {
        console.log(MID);
        MID = MID !== null ? MID[0] : null;
        let match = await matchModel.getByMID(MID);
        title = "Match : " + match.name;
        color = "info";
        responce = [
          { name: "match id (**MID**)", value: match.MID, inline: true },
          {
            name: "organizer",
            value: match.organizer.username,
            inline: true,
          },
          { name: "players", value: match.players.length, inline: true },
        ];
        //console.log("matches.players",match.players);
        if (msg.author.id === match.organizer.id) {
          return await embed.poll(
            match,
            responce,
            msg,
            title,
            description,
            ["INVITED", "UPDATE", "DELETE", "View all"],
            0,
            "match"
          );
        } else {
          responce.push([
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
            
          ]);
          return await embed.poll(
            match,
            responce,
            msg,
            title,
            description,
            ["View match"],
            0,
            "accept"
          );
        }
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
      } else {
        responce = {
          name: "Sorry, encountered a problem. Try again!",
          value: "\u200B",
        };
      }
      return msg.channel.send(embed.sms(responce, title, description, color));
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

module.exports = match;
