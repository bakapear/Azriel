let util = require('../util')

module.exports = {
  name: 'timer',
  aliases: [],
  description: 'Sets a timer.',
  permissions: [],
  args: 1,
  usage: 'list | <H:M:S> (M/D/Y)',
  exec: async (msg, cmd) => {
    if (cmd.args[0] === 'list') {
      if (!timers[msg.author.id]) return msg.channel.send(`You don't have any active timers running!`)
      return util.showEmbedList(msg.channel, timers[msg.author.id], 0, x => {
        return {
          title: 'Your active timers',
          description: x.map(x => `\`${x.time}\``).join('\n')
        }
      }, 50)
    }
    let date = new Date()
    let time = formatTime(cmd.args[0], cmd.args[1])
    if (date >= time) return msg.channel.send('Please enter a time in the future.')
    if (!timers[msg.author.id]) {
      timers[msg.author.id] = []
    }
    let timer = {
      time: time.toLocaleString('de'),
      timeout: setTimeout(() => {
        msg.channel.send(`<@${msg.author.id}> RRRRRRRRRRRRRRRRRRRR`)
        let index = timers[msg.author.id].indexOf(timer)
        if (index >= 0) timers[msg.author.id].splice(index, 1)
        if (!timers[msg.author.id].length) delete timers[msg.author.id]
      }, time - date)
    }
    timers[msg.author.id].push(timer)
    return msg.channel.send(`Timer set for: \`${timer.time}\``)
  }
}

function formatTime (time, date) {
  time = time.split(':')
  let r = new Date()
  r.setHours(parseInt(time[0]))
  r.setMinutes(parseInt(time[1]) || 0)
  r.setSeconds(parseInt(time[2]) || 0)
  if (date) {
    date = date.split('/')
    if (date[0]) r.setDate(parseInt(date[0]))
    if (date[1]) r.setMonth(parseInt(date[1]) - 1)
    if (date[2]) r.setFullYear(parseInt(date[2]))
  }
  return r
}

let timers = {}
