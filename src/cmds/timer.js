let { util } = require('../mod')

module.exports = {
  name: 'timer',
  aliases: ['t'],
  description: 'Set off a timer',
  permissions: [],
  args: 0,
  usage: '<time> / clear',
  async exec (msg, cmd) {
    let timer = timers[msg.author.id]
    if (!cmd.args.length) {
      if (!timer) return msg.channel.send('You have no active timer')
      else return msg.channel.send(`Timer set for \`${timer.text}\``)
    }
    if (cmd.args[0] === 'clear') {
      if (!timer) return msg.channel.send('You have no active timer')
      else {
        clearTimeout(timer.timeout)
        delete timers[msg.author.id]
        return msg.channel.send('Successfully cleared your timer.')
      }
    }
    if (timer) return msg.channel.send('Timer already set.')
    let ms = textToMs(cmd.content)
    if (ms <= 0) return msg.channel.send('Invalid time given!')
    let date = new Date(Date.now() + ms)
    timers[msg.author.id] = {
      timeout: setTimeout(() => {
        msg.reply(util.randomItem(REPLIES))
        delete timers[msg.author.id]
      }, ms),
      text: date.toLocaleString('uk').replace(', ', ' - ')
    }
    return msg.channel.send(`Timer set for \`${timers[msg.author.id].text}\``)
  }
}

let timers = {}

function textToMs (str) {
  str = str.replace(/((h)ours?|(m)inutes?|(s)econds?)/g, (...args) => {
    return args.slice(0, -2).filter(x => x).pop()
  })
  let parts = { h: 0, m: 0, s: 0 }
  let match = null
  let regex = /(\d+) ?(h|m|s)/g
  do {
    match = regex.exec(str)
    if (match) parts[match[2]] = Number(match[1])
  } while (match)
  return (parts.h * 3600000) + (parts.m * 60000) + (parts.s * 1000)
}

let REPLIES = [
  'RRRRRRRRRRRRRR',
  'DING DING DING',
  'Woof woof',
  'HEY!',
  'Hey! Listen!',
  'Your timer is going all like IAJEFUIAJIOFUeaHJUIOF',
  'LOLI ALERT'
]
