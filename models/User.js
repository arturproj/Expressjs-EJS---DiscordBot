/**
 *  MongoClient.connect.client.db
 * @param {*} db
 *  Discord ID:String
 * @param {*} discordId
 *  Database users initialization
 * @param {*} userModel
 *  Database logs initialization
 * @param {*} loggerModel
 *
 * @getByDiscordId
 * @return {*} {user}
 *
 * @setDiscordUser
 * @return {*} ?
 */
class User {
  constructor(db) {
    this.db = db.collection("users_list");
  }
  async getByDiscordId(discordId) {
    return this.db.findOne({ discordId: discordId });
  }
  async setDiscordUser(user) {
    const newPlayer = {
      username: user.username,
      discordId: user.discordId,
      bot: user.bot,
      discriminator: user.discriminator,      
      account: user.account,
      created: new Date(),
      //_v: 0,
    };
    //console.log(newPlayer);
    return this.db.insertOne(newPlayer);
  }
}

module.exports = User;
