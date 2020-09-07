const MatchBOX = require("./../../models/Matches");

const {
  CL_SUCCESS,
  CL_DANGER,
  CL_WARNING,
  CL_INFO,
  EMBED_TITLE_DEFAULT,
  EMBED_MSG_DEFAULT,
  EMBED_DESCR_DEFAULT,
  EMBED_BOT_NAME_DEFAULT,
  EMBED_BOT_ICON_DEFAULT,
} = process.env;

const sms = (
  message = EMBED_MSG_DEFAULT,
  title = EMBED_TITLE_DEFAULT,
  description = EMBED_DESCR_DEFAULT,
  color = "danger",
  name = EMBED_BOT_NAME_DEFAULT,
  icon = EMBED_BOT_ICON_DEFAULT
) => {
  console.log("color:", colors[color])
  return {
    embed: {
      color: "#" + colors[color],
      title,
      description,
      fields: Array.isArray(message) ? [...message] : message,
      timestamp: new Date(),
      footer: {
        text: name,
        icon_url: icon,
      },
    },
  };
};

const poll = async (
  match,
  embed_req,
  msg,
  title,
  description = "",
  options,
  timeout = 30,
  emojiList = "check"
) => {
  emojiList = defEmojiList[emojiList].slice();
  console.log(emojiList);
  if (!msg && !msg.channel) return msg.reply("Channel is inaccessible.");
  if (!title) return msg.reply("Poll title is not given.");
  if (!options) return msg.reply("Poll options are not given.");
  if (options.length < 1)
    return msg.reply("Please provide more than one choice.");
  if (options.length > emojiList.length)
    return msg.reply(`Please provide ${emojiList.length} or less choices.`);

  let text = `You've been invited to the **Zelda** match\n\n`;
  const emojiInfo = {};
  const author = msg.author;
  embed_req.push({
    name: `\`Question\` `,
    value: "click on the emoji for execute next action",
  });
  for (const option of options) {
    const emoji = emojiList.splice(0, 1);
    emojiInfo[emoji] = { option: option, votes: 0 };
    embed_req.push({ name: `${emoji} : \`${option}\``, value: "\u200B" });
  }
  const usedEmojis = Object.keys(emojiInfo);

  const poll = await msg.channel.send(
    sms(embed_req, title, description, "success")
  );
  for (const emoji of usedEmojis) await poll.react(emoji);
  const reactionCollector = poll.createReactionCollector(
    (reaction, user) => usedEmojis.includes(reaction.emoji.name) && !user.bot,
    timeout === 0 ? {} : { time: timeout * 1000 }
  );
  reactionCollector.on("collect", (reaction, user) => {
    //reactionCollector.stop();
    //console.log("collect", reaction);

    if (reaction.emoji.name === "1⃣") {
      console.log(reaction.emoji.name);
      msg.channel.send(`!invite ${match.MID}`);
    }
    if (reaction.emoji.name === "2⃣") {
      console.log(reaction.emoji.name);
      msg.channel.send(`!update ${match.MID}`);
    }
    if (reaction.emoji.name === "3⃣") {
      console.log(reaction.emoji.name);
      msg.channel.send(`!delete ${match.MID}`);
    }
    if (reaction.emoji.name === "4⃣") {
      console.log(reaction.emoji.name);
      msg.channel.send(`!match`);
    }
    

    if (reaction.emoji.name === "✅") {
      emojiInfo["responce"] = { name: "ACCEPT", value: "u200B" };
      if (options.includes("View match")) {
        msg.channel.send(`!match ${match.MID} `);
      }
      if (options.includes("View all match")) {
        msg.channel.send(`!match`);
      }
      if (options.includes("Invite all guild users")) {
        msg.channel.send("!invite VT3CD @everyone");
        console.log(reaction.emoji.name);
      }
    }

    if (reaction.emoji.name === "❔") {
      if (options.includes("Tutorial update match")) {
        msg.channel.send({
          embed: {
            color: "#FFA0A0", //Math.floor(Math.random() * 16777214) + 1,  //random color between one and 16777214 (dec)
            description: [
              `**---** update **name**`,
              `write \`!update ${match.MID} \`**name**\`=<NEW NAME>\` `,
              `example: !update ${match.MID} \`name=CUP 2050\``,
              `**---** update **city**`,
              `write \`!update ${match.MID} \`**city**\`=<NEW NAME>\` `,
              `example: !update ${match.MID} \`city=Paris\` `,
              `**---** update **date**`,
              `write \`!update ${match.MID} \`**date**\`=<NEW DATE>\` `,
              `example:!update ${match.MID} \`date=01-01-2050 14:20\` `,
              `**---** update **level**`,
              `write \`!update ${match.MID} \`**level**\`=<number [1-10]>\` `,
              `example: !update ${match.MID} \`level=10\` `,
              `**---** update **gender**`,
              `write \`!update ${match.MID} \`**gender**\`=<male | female | mixed>\` `,
              `example: !update ${match.MID} \`gender=mixed\` `,
            ].join("\n\n"),
          },
        });
        console.log(reaction.emoji.name);
      }
      if (options.includes("Tutorial invite match")) {
        msg.channel.send({
          embed: {
            color: "#FFA0A0", //Math.floor(Math.random() * 16777214) + 1,  //random color between one and 16777214 (dec)
            description: [
              // `**---** invite **all gild players**`,
              // `write \`!invite ${match.MID} @everyone\` `,
              `**---** invite **only 1 player**`,
              `write \`!invite ${match.MID} <PLAYER NAME>\` `,
              `example: !invite ${match.MID} \`@Player\``,
            ].join("\n\n"),
          },
        });
        console.log(reaction.emoji.name);
      }
    }
    if (reaction.emoji.name === "❌") {
      emojiInfo["responce"] = { name: "ACCEPT", value: "u200B" };
    }
    //emojiInfo[emoji].responce
  });
  reactionCollector.on("end", (reaction, user) => {
    //console.log(author, match);
    console.log(reaction);
  });

  return await reactionCollector;
};

const updateMatch = async (db, MID, user) => {
  //console.log("updateMatch", MID);
  user = {
    id: user.id,
    username: user.username,
    discriminator: user.discriminator,
  };
  //console.log("updateMatch !user", user);
  const matchModel = new MatchBOX(db);
  let res = await matchModel.joinMatch(MID, user);
  //console.log("updateMatch !res", res);
  return res;
};

const invitation = async (
  match,
  embed_req,
  msg,
  title,
  description = "",
  options,
  timeout = 30,
  emojiList = "check",
  bot,
  id,
  db
) => {
  emojiList = defEmojiList[emojiList].slice();
  console.log(emojiList);
  if (!msg && !msg.channel) return msg.reply("Channel is inaccessible.");
  if (!title) return msg.reply("Poll title is not given.");
  if (!options) return msg.reply("Poll options are not given.");
  if (options.length < 1)
    return msg.reply("Please provide more than one choice.");
  if (options.length > emojiList.length)
    return msg.reply(`Please provide ${emojiList.length} or less choices.`);

  let text = `You've been invited to the **Zelda** match\n\n`;
  const emojiInfo = {};
  const author = msg.author;
  embed_req.push({
    name: `\`Question\` `,
    value: "click on the emoji for execute next action",
  });
  for (const option of options) {
    const emoji = emojiList.splice(0, 1);
    emojiInfo[emoji] = { option: option, votes: 0 };
    embed_req.push({ name: `${emoji} : \`${option}\``, value: "\u200B" });
  }
  const usedEmojis = Object.keys(emojiInfo);

  const poll = await bot.users.cache
    .get(id)
    .send(sms(embed_req, title, description, "invite"));
  for (const emoji of usedEmojis) await poll.react(emoji);
  const reactionCollector = poll.createReactionCollector(
    (reaction, user) => usedEmojis.includes(reaction.emoji.name) && !user.bot,
    timeout === 0 ? {} : { time: timeout * 1000 }
  );
  reactionCollector.on("collect", (reaction, user) => {
    //console.log(user);
    if (reaction.emoji.name === "✅" && options.includes("invite accept")) {
      let update = updateMatch(db, match.MID, user);
      console.log("collect", user);
      update.then((res) => {
        console.log(res)
        let title = `Join to match ${match.name}`;
        let description = `@**${user.username}** accepted your invitation`;
        let responce = { name: "\u200B", value: "\u200B" };
        if (res.responce !== false) {
          bot.users.cache
            .get(res.organizer.id)
            .send(sms(responce, title, description, "invite"));
            bot.users.cache
            .get(user.id)
            .send(`!match ${match.MID}`);
        }else{
          description = `@**${user.username}** is already registered for the match`;
          bot.users.cache
          .get(match.organizer.id)
          .send(sms(responce, title, description, "invite"));
        }
        bot.users.cache
        .get(user.id)
        .send(`!match ${match.MID}`);
      });
     
    }

    if (reaction.emoji.name === "❌" && options.includes("invite decline")) {
      
        let title = `Join to match ${match.name}`;
        let description = `@**${user.username}** refused your invitation`;
        let responce = { name: "\u200B", value: "\u200B" };

        bot.users.cache
          .get(match.organizer.id)
          .send(sms(responce, title, description, "invite"));
      
    }

    reactionCollector.stop();

    // if (reaction.emoji.name === "❔") {
    //   msg.channel.send(`!match ${match.MID} `);
    // }
  });
  reactionCollector.on("end", () => {
    poll.delete();
  });

  return await reactionCollector;
};
module.exports = {
  sms,
  poll,
  invitation,
};

const defEmojiList = {
  quest: ["\u2754"],
  next: ["\u2754", "\u2705"],
  invite: ["\u2705", "\u274C", "\u2754"],
  accept: ["\u2705"],
  decline: ["\u274C"],
  check: ["\u2705", "\u274C"],
  match: ["\u0031\u20E3", "\u0032\u20E3", "\u0033\u20E3", "\u0034\u20E3"],
  update: ["\u0034\u20E3"],
  // "\u0035\u20E3",
  // "\u0036\u20E3",
  // "\u0037\u20E3",
  // "\u0038\u20E3",

  // "\u0039\u20E3",
  // "\uD83D\uDD1F",
};

const colors = {
  success: CL_SUCCESS,
  danger: CL_DANGER,
  warning: CL_WARNING,
  info: CL_INFO,
  invite: (Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6),
};
