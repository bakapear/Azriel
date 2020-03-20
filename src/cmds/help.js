let util = require('../util')
let handler = require('../handler')

module.exports = {
  name: 'help',
  aliases: ['?', 'cmd'],
  description: 'Gets information about a command.',
  permissions: [],
  args: 0,
  usage: '(command)',
  exec: async (msg, cmd) => {
    let commands = handler.getCommands()
    if (!cmd.content) {
      return util.showEmbed(msg.channel, {
        description: `Commands (${commands.length})`,
        footer: { text: commands.map(x => x.name).join(' ') }
      })
    }
    let command = commands.find(x => [x.name, ...x.aliases].includes(cmd.args[0].toLowerCase()))
    if (command) {
      return util.showEmbed(msg.channel, {
        title: command.name,
        description: [
          `**Aliases**: ${command.aliases.join(', ')}`,
          `**Description**: ${command.description}`,
          `**Usage**: ${command.usage}`
        ].join('\n')
      })
    }
    return msg.channel.send(`The command '${cmd.args[0]}' does not exist!`)
  }
}
