let dp = require('despair')

module.exports = {
  name: 'catfact',
  description: 'Get a random cat fact',
  async exec (msg, cmd) {
    let body = await dp('https://cat-fact.herokuapp.com/facts/random').json()
    return msg.channel.send(body.text)
  }
}
