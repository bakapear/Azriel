global.TIMEOUTS = {}

module.exports = {
  name: 'timeout',
  args: 1,
  usage: '<user> (clear/<seconds>)',
  description: 'Timeout specific users so they cant use commands for a while',
  async exec (msg, cmd) {
    if (msg.member.user.id !== '284425943034888204') return msg.channel.send('Only beel herself can timeout people.')

    let member = msg.guild.members.cache.find(x => x.user.username.toLowerCase().indexOf(cmd.args[0].toLowerCase()) >= 0)
    if (!member) return msg.channel.send('Couldn\'t find that user!')

    if (!global.TIMEOUTS[member.user.id]) global.TIMEOUTS[member.user.id] = 1

    let t = global.TIMEOUTS[member.user.id]

    if (!cmd.args[1]) {
      if (!t || (Date.now() - t) >= 0) return msg.channel.send(`\`${member.user.username}\` has no active timeout.`)
      return msg.channel.send(`\`${member.user.username}\` has an active timeout until \`${(new Date(t)).toLocaleString('uk').replace(', ', ' - ')}\``)
    }

    if (cmd.args[1] === 'clear') {
      if (!t || (Date.now() - t) >= 0) return msg.channel.send(`\`${member.user.username}\` has no active timeout.`)
      global.TIMEOUTS[member.user.id] = 1
      return msg.channel.send(`Cleared timeout for \`${member.user.username}\`.`)
    } else if (!isNaN(cmd.args[1])) {
      global.TIMEOUTS[member.user.id] = Date.now() + (Number(cmd.args[1]) * 1000)
      return msg.channel.send(`Timed \`${member.user.username}\` out until \`${(new Date(Date.now())).toLocaleString('uk').replace(', ', ' - ')}\`.`)
    } else return msg.channel.send(`Invalid action '${cmd.args[1]}'`)
  }
}
