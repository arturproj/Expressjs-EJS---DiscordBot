const { MessageEmbed } = require("discord.js");

const defEmojiList = {
  Invitation: ["\u2705", "\u274C"],
  quest: [
    "\u0031\u20E3",
    "\u0032\u20E3",
    "\u0033\u20E3",
    "\u0034\u20E3",
    "\u0035\u20E3",
    "\u0036\u20E3",
    "\u0037\u20E3",
    "\u0038\u20E3",
    "\u0039\u20E3",
    "\uD83D\uDD1F",
  ],
};

const pollEmbed = async (
  match,
  msg,
  title,
  options,
  timeout = 30,
  emojiList = "Invitation"
) => {
  emojiList = defEmojiList[emojiList].slice();
  if (!msg && !msg.channel) return msg.reply("Channel is inaccessible.");
  if (!title) return msg.reply("Poll title is not given.");
  if (!options) return msg.reply("Poll options are not given.");
  if (options.length < 2)
    return msg.reply("Please provide more than one choice.");
  if (options.length > emojiList.length)
    return msg.reply(`Please provide ${emojiList.length} or less choices.`);

  let text = `You've been invited to the **Zelda** match\n\n`;
  const emojiInfo = {};
  const author = msg.author;
  for (const option of options) {
    const emoji = emojiList.splice(0, 1);
    emojiInfo[emoji] = { option: option, votes: 0 };
    text += `${emoji} : \`${option}\`\n\n`;
  }
  const usedEmojis = Object.keys(emojiInfo);

  const poll = await msg.channel.send(
    embedBuilder(title, msg.author.tag).setDescription(text)
  );
  for (const emoji of usedEmojis) await poll.react(emoji);

  const reactionCollector = poll.createReactionCollector(
    (reaction, user) => usedEmojis.includes(reaction.emoji.name) && !user.bot,
    timeout === 0 ? {} : { time: timeout * 1000 }
  );

  reactionCollector.on("collect", (reaction, user) => {
    console.log("collect", reaction.emoji);
    if (reaction.emoji.name === "✅") {
      emojiInfo["responce"] = "ACCEPT INVITATION";
      console.log(author, match);
    }
    if (reaction.emoji.name === "❌") {
      emojiInfo["responce"] = "DECLINE INVITATION";
    }
    //emojiInfo[emoji].responce

    return reactionCollector.stop();
  });
  reactionCollector.on("end", () => {
    text = "*Ding! Ding! Ding! Time's up!\n Results are in,*\n\n";
    text += `\`${emojiInfo["responce"]}\n\n`;
    poll.delete();
    msg.channel.send(embedBuilder(title, msg.author.tag).setDescription(text));
  });
};

const embedBuilder = (title, author) => {
  return new MessageEmbed()
    .setTitle(title)
    .setFooter(`Invitation created by @${author}`);
};

module.exports = pollEmbed;
