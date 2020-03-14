/* global bot */

module.exports = {
  name: 'uptime',
  aliases: ['up'],
  description: `Displays how long I've been running for.`,
  permissions: [],
  args: 0,
  usage: '',
  exec: async (msg, cmd) => {
    msg.channel.send([
      `**Process**: ${t(process.uptime())}`,
      `**Bot**: ${t(bot.uptime / 1000)}`
    ].join('\n'))
  }
}

function t (s) {
  let d = Math.floor(s / (3600 * 24))
  let a = new Date(s * 1000).toISOString().substr(11, 8)
  return `${d} Days ${a}`
}
