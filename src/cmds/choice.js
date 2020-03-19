let util = require('../util')

module.exports = {
  name: 'choice',
  aliases: ['pick', 'decide'],
  description: 'I will pick one of the choices given.',
  permissions: [],
  args: 2,
  usage: '<choice1> <choice2> (choice3) (...)',
  exec: async (msg, cmd) => {
    msg.channel.send(util.randomItem(cmd.args))
  }
}
