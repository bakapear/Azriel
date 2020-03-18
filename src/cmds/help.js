/* global cfg */

let handler = require('../handler')

module.exports = {
  name: 'help',
  aliases: ['?', 'cmd'],
  description: `Gets information about a command.`,
  permissions: [],
  args: 0,
  usage: '(command)',
  exec: async (msg, cmd) => {
    let commands = handler.items
    if (!cmd.content) {
      msg.channel.send({
        embed: {
          color: cfg.color,
          description: `Commands (${commands.length})`,
          footer: {
            text: commands.map(x => x.name).join(' ')
          }
        }
      })
    } else {
      let command = commands.find(x => [x.name, ...x.aliases].includes(cmd.args[0].toLowerCase()))
      if (command) {
        msg.channel.send({
          embed: {
            color: cfg.color,
            title: command.name,
            description: [
              `**Aliases**: ${command.aliases.join(', ')}`,
              `**Description**: ${command.description}`,
              `**Usage**: ${command.usage}`
            ].join('\n')
          }
        })
      } else {
        msg.channel.send(`The command '${cmd.args[0]}' does not exist!`)
      }
    }
  }
}
