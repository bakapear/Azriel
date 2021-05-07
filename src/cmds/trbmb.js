let dp = require('despair')

module.exports = {
  name: 'trbmb',
  description: 'That really blanks my blank generator',
  async exec (msg, cmd) {
    let body = await dp('http://api.chew.pro/trbmb').json()
    return msg.channel.send(body[0])
  }
}
