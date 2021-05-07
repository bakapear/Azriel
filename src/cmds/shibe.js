let { util } = require('../mod')
let dp = require('despair')

module.exports = {
  name: 'shibe',
  description: 'Display a random cute shibe',
  async exec (msg, cmd) {
    let body = await dp('https://shibe.online/api/shibes').json()
    return util.sendImage(msg, body[0])
  }
}
