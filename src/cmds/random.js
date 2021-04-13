/* global bot */
let util = require('../util')

module.exports = {
  name: 'random',
  aliases: ['rnd'],
  description: 'Picks a random member of the server.',
  permissions: [],
  args: 0,
  usage: '',
  exec: async (msg, cmd) => {
    let user = util.randomItem(bot.users.cache.filter(x => !x.bot).array()).username
    return msg.channel.send(user)
  }
}
