const embed = require("./core/embed");

const { User, Logger, Match } = require("../models");
const stringGen = require("./core/stringGen");

/**
 *  MongoClient.connect.client.db
 * @param {*} db
 *  Discord:obj
 * @param {*} obj
 *  Database users initialization
 * @param {*} userModel
 *  Database logs initialization
 * @param {*} loggerModel
 *
 * @return {*} Boolean
 */
class create {
  constructor(db) {
    this.db = db;
    this.userModel = new User(db);
    this.loggerModel = new Logger(db);
    this.matchModel = new Match(db);
  }

  async createMatch(obj) {
    let match_name = obj.content.match(/!create [\s\S]*$/g);
    match_name = match_name[0].replace("!create ", "");
    console.log("match_name", match_name, obj.content);

    var iniw = true;
    let genMID;
    while (iniw === true) {
      genMID = stringGen(5);
      let check = await this.matchModel.getByMID(genMID);
      console.log("genMID", genMID, "check", check);
      if (check === null) {
        iniw = false;
      }
    }
    let date = new Date();
    return {
      MID: genMID,
      name: match_name,
      organizer: {
        id: obj.author.id,
        username: obj.author.username,
        discriminator: obj.author.discriminator,
      },
      created: `${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`,
    };
  }

  async start(obj) {
    let responce, color;
    const match = await this.createMatch(obj);
    //console.log(match)
    const title = "Match **" + match.name + "**";
    let description = "";
    try {
      const user = await this.userModel.getByDiscordId(obj.author.id);
      if (user !== null && user.account === "organizer") {
        let res = await this.matchModel.setMatch(match);
        color = "success";
        responce = [
          { name: "match id (**MID**)", value: match.MID },
          {
            name: "created",
            value: match.created,
            inline: true,
          },
          { name: "organizer", value: match.organizer.username, inline: true },
          {
            name: "Next step view match",
            value: `example: !match ${match.MID}`,
          },
        ];
        return await embed.poll(
          match,
          responce,
          obj,
          title,
          description,
          ["View match"],
          0,
          "accept"
        );
      } else {
        color = "danger";
        responce = [
          {
            name: "Sorry, only the ORGANIZER can create new match!",
            value: `${match.name}-MID(${match.MID}) not created`,
          },
        ];
        return await embed.poll(
          match,
          responce,
          obj,
          title,
          description,
          ["View all match"],
          0,
          "accept"
        );
      }
    } catch (err) {
      console.error(err);
      await this.loggerModel.setLogs("_create", obj.author.id, "error", err);
      return embed.sms(
        "Sorry, encountered a problem. Try again!",
        title,
        description,
        "danger"
      );
    }
  }
}

module.exports = create;
