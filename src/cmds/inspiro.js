let util = require('../util')
let dp = require('despair')

module.exports = {
  name: 'inspiro',
  aliases: [],
  description: 'Displays a random motivational picture.',
  permissions: [],
  args: 0,
  usage: '',
  exec: async (msg, cmd) => {
    let { body } = await dp('https://inspirobot.me/api', { query: { generate: true } })
    let img = await util.attachImages([body])
    return msg.channel.send({ files: img })
  }
}
