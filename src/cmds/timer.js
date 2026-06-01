let { util } = require('../mod')
let ph = require('path')

let path = ph.join(__dirname, '..', 'data', 'timer')

module.exports = {
  name: 'timer',
  aliases: ['t'],
  description: 'Set off a timer',
  permissions: [],
  args: 0,
  usage: '<time> (message) / clear',
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
    if (ms.time <= 0) return msg.channel.send('Invalid time given!')
    let date = new Date(Date.now() + ms.time)
    timers[msg.author.id] = {
      timeout: setTimeout(() => {
        msg.reply(ms.str || util.readRandomLine(ph.join(path, 'replies.txt')))
        delete timers[msg.author.id]
      }, ms.time),
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
  let res = str
  let offs = 0
  do {
    match = regex.exec(str)
    if (match) {
      parts[match[2]] = Number(match[1])
      res = res.substr(0, match.index - offs) + res.substr(match.index - offs + match[0].length)
      offs += match[0].length
    }
  } while (match)
    
  return { time: (parts.h * 3600000) + (parts.m * 60000) + (parts.s * 1000), str: res.trim() }
}
