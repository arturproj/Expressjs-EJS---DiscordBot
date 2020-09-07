const embed = require("./core/embed");
module.exports = () => {
  let responce = [
    { name: "\u200B", value: "\u200B" },
    { name: "**!create** <name>", value: "create match" },
    { name: "**!match**", value: "manager match" },
    {
      name: "**!signup** <account>",
      value: "registred you **organizer** | **player** | **viewer**",
    },
    { name: "**!ping**", value: "check your state" },
    { name: "\u200B", value: "\u200B" },
  ];
  let description = "";
  return embed.sms(responce, "**Help ?!**", description, "info");
};
