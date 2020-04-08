/* global bot, cfg */

module.exports = {
  init: () => {
    require('./presence.js')
    require('./events')
  },
  pass: msg => {
    if (require('./link.js')(msg)) return
    if (!Object.values(cfg.prefix).includes(msg.content[0]) || msg.author.id === bot.user.id) return
    if (msg.content[0] === cfg.prefix.hidden) msg.delete().catch(() => {})
    return true
  }
}
