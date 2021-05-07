let dp = require('despair')

module.exports = {
  name: 'ronswanson',
  aliases: ['ron', 'swanson'],
  description: 'Get a Ron Swanson quote',
  async exec (msg, cmd) {
    let body = await dp('http://ron-swanson-quotes.herokuapp.com/v2/quotes').json()
    return msg.channel.send(body[0])
  }
}
