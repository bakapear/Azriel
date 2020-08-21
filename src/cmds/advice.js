let util = require('../util')

module.exports = {
  name: 'advice',
  aliases: [],
  description: 'ripped from Prodibot',
  permissions: [],
  args: 0,
  usage: '',
  exec: async (msg, cmd) => {
    return util.showEmbed(msg.channel, {
      color: 1438035,
      fields: [
        {
          name: 'your advice',
          value: util.randomItem(advice),
          inline: true
        },
        {
          name: 'second opinion',
          value: util.randomItem(advice),
          inline: true
        }
      ]
    })
  }
}

let advice = ['you dont stand a chance nerd.', 'you still dont stand a chance']
