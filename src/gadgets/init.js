/* global bot, cfg */
let ph = require('path')
let fs = require('fs')
let { handler } = require('../mod')
let c = handler.color

module.exports = {
  async init () {
    this.randomPresence()
    loadEvents()
    welcome()
  },
  async pass (msg) {
    if (msg.author.id === bot.user.id) return
    if (!Object.values(cfg.prefix).includes(msg.content[0])) return
    if (msg.content[0] === cfg.prefix.hidden) msg.delete().catch(() => {})
    return true
  }
}

function welcome () {
  let ms = ` ${c.black(`Your personal servant ${c.yellow(bot.user.tag)} is waiting for orders!`)} `.padEnd(58)
  let len = ms.length - 25
  handler.log([
    c.red(`┏${'━'.repeat(len)}┓`),
    c.red('┃') + ms + c.red('┃'),
    c.red(`┗${'━'.repeat(len)}┛`)
  ].join('\n'))
}

function loadEvents () {
  let path = ph.join(__dirname, 'events')
  let dir = fs.readdirSync(path)
  for (let i = 0; i < dir.length; i++) require(ph.join(path, dir[i]))
}
