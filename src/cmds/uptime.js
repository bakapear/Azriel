/* global bot */
let { util } = require('../mod')

module.exports = {
  name: 'uptime',
  aliases: ['up'],
  description: 'Display how long I\'ve been running for',
  async exec (msg, cmd) {
    let ms = bot.uptime
    let days = ~~(ms / 1000 / 60 / 60 / 24)
    return msg.channel.send(`**Uptime**: \`${util.hms(ms, true)}\` (${days} Day${days === 1 ? '' : 's'})`)
  }
}
