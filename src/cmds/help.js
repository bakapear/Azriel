let { handler } = require('../mod')

module.exports = {
  name: 'help',
  aliases: ['commands', 'cmds'],
  description: 'Get a list of all my commands and check their usage',
  usage: '(command)',
  async exec (msg, cmd) {
    if (!cmd.args.length) {
      return msg.channel.send({
        embed: {
          description: [
            `Commands (${handler.CMDS.length})`
          ].join('\n'),
          footer: {
            text: handler.CMDS.map(x => x.name).join(' ')
          }
        }
      })
    }
    let command = handler.CMDS.find(x => x.name === cmd.args[0] || x.aliases.some(y => y === cmd.args[0]))
    if (!command) return msg.channel.send(`Command '${cmd.args[0]}' not found!`)
    return msg.channel.send({
      embed: {
        title: command.name,
        description: [
          command.aliases.length ? '**Aliases**: ' + command.aliases.join(', ') : '',
          command.description ? '**Description**: ' + command.description : '',
          '**Usage**: ' + `\`${cmd.prefix}${command.name} ${command.usage}\``
        ].join('\n')
      }
    })
  }
}
