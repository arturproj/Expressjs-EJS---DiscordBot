const Discord = require("discord.js");
const registerObj = require("./register");
const checkObj = require("./check");
const createObj = require("./create");
const matchObj = require("./match");
const help = require("./help");

class BOT{
    constructor(db){
        this.db = db
        this.bot = new Discord.Client()
    }

    start(TOKEN){
        const register = new registerObj(this.db);
        const check = new checkObj(this.db);
        const create = new createObj(this.db);
        const match = new matchObj(this.db);

        this.bot.on("guildCreate", (guild) => {
          guild.channel.send("hello");
        });
      
        this.bot.on("ready", () => {
          console.info(`Logged in as ${this.bot.user.tag}!`);
        });
      
        this.bot.on("message", (msg) => {
          if (!msg.content.startsWith("!") || msg.author.bot) return;
      
          const args = msg.content.slice(1).trim().split(/ +/);
          const command = args.shift().toLowerCase();
          //console.log("main", msg.author)
          switch (command) {
            case "signup":
              register.start(msg).then((res) => msg.reply(res));
              break;
            case "create":
              create.start(msg).then((res) => msg.channel.send(res));
              break;
            case "match":
              match.start(msg).then((res) => msg.channel.send(res));
              break;
            case "ping":
              check.start(msg.author.id).then((res) => msg.reply(res));
              break;
            default:
              msg.channel.send(help());
              break;
          }
        });
      
        this.bot.login(TOKEN);
    }
}
module.exports = { BOT }
