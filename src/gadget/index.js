/* global bot, cfg */

module.exports = {
  init: () => {
    setInterval(require('./presence.js'), 654321)
  },
  pass: msg => {
    if (!cfg.prefix.includes(msg.content[0]) || msg.author.id === bot.user.id) return
    if (msg.content[0] === cfg.prefix[1]) msg.delete().catch(() => {})
    return true
  }
}
