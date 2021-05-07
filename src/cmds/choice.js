let { util } = require('../mod')

module.exports = {
  name: 'choice',
  aliases: ['pick', 'decide'],
  description: 'I will pick one of the choices given',
  args: 2,
  usage: '<choice1> <choice2> (choice3) (...)',
  async exec (msg, cmd) {
    return msg.channel.send(util.randomItem(cmd.args))
  }
}
