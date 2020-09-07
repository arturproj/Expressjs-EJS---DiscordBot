const { HOST, PORT, TOKEN } = process.env;
const express = require("express");
const Discord = require("discord.js");

/**
 *
 * @param {*} db
 */
const start = (db) => {
  const app = express();

  const port = PORT || 3000;

  // const Bot = new BOT(db);

  // Bot.start(TOKEN);

  const bot = new Discord.Client({
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
  });

  bot.on("guildCreate", (guild) => {
    guild.channel.send("hello");
  });

  bot.on("ready", () => {
    console.info(`Logged in as ${bot.user.tag}!`);
  });

  bot.on("message", (msg) => {
    // || msg.author.bot
    if (!msg.content.startsWith("!")) return;
    let MID = msg.content.match(/[A-Z|0-9]\w+/g);
    const args = msg.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    //console.log("main", msg.author)
    //msg.channel.send('!help')
    switch (command) {
      case "join":
        const joinObj = require("./controller/join");
        const join = new joinObj(db);

        if (MID !== null) {
          join.start(msg).then((res) => {
            bot.users.cache
              .get(res.organizer.to.id)
              .send(res.organizer.responce);
            bot.users.cache.get(msg.author.id).send(res.responce);
            bot.users.cache.get(msg.author.id).send(`!match ${MID[0]}`);
            console.log(res);
          });
        }
        break;
      case "signup":
        const registerObj = require("./controller/register");
        const register = new registerObj(db);
        register.start(msg).then((res) => msg.reply(res));
        break;
      case "create":
        const createObj = require("./controller/create");
        const create = new createObj(db);
        create.start(msg);
        break;
      case "leave":
        const leaveObj = require("./controller/leave");
        const leave = new leaveObj(db);
        if (MID !== null) {
          leave
            .start(msg)
            .then((res) => bot.users.cache.get(res.to.id).send(res.responce));
        }
        break;
      case "update":
        const updateObj = require("./controller/update");
        const update = new updateObj(db);
        update.start(msg);
        break;
      case "delete":
        const deleteObj = require("./controller/delete");
        const delet = new deleteObj(db);
        delet.start(msg).then((res) => {
          // bot.users.cache
          //   .get(res.users.organizer.id)
          //   .send(res.responce.organizer)
          res.users.players.forEach((element) => {
            bot.users.cache.get(element.id).send(res.responce.players);
          });
        });
        break;
      case "match":
        const matchObj = require("./controller/match");
        const match = new matchObj(db);
        match.start(msg);
        break;
      case "ping":
        const checkObj = require("./controller/check");
        const check = new checkObj(db);
        bot.users.fetch(msg.author.id).then((source) =>
          check.start(msg.author.id, source.avatarURL()).then((res) => {
            bot.users.cache.get(msg.author.id).send(res);
          })
        );
        break;
      case "invite":
        const invitedObj = require("./controller/invited");
        const invited = new invitedObj(db);
        invited.start(bot, msg);
        break;
      default:
        const help = require("./controller/help");
        msg.channel.send(help());
        break;
    }
  });

  bot.login(TOKEN).catch(console.error);
  bot.on("debug", console.log);
  bot.on("shardError", (error) => {
    console.error("A websocket connection encountered an error:", error);
  });
  ////////////////////////////////////////////////////////////////
  app.use("*", (req, res) => {
    res.send("RugbyBot");
  });
  ////////////////////////////////////////////////////////////////
  app.listen(port, () => {
    console.log(`Server started on : http://${HOST}:${port}`);
  });
};

module.exports = start;
