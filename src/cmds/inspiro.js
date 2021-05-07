let { util } = require('../mod')
let dp = require('despair')

module.exports = {
  name: 'inspiro',
  description: 'Display a random motivational picture',
  async exec (msg, cmd) {
    let body = await dp('https://inspirobot.me/api', { query: { generate: true } }).text()
    return util.sendImage(msg, body)
  }
}
