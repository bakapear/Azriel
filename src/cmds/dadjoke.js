let dp = require('despair')

module.exports = {
  name: 'dadjoke',
  aliases: ['dad'],
  description: 'Tell a random dad joke',
  async exec (msg, cmd) {
    let body = await dp('https://icanhazdadjoke.com', {
      headers: { Accept: 'application/json' }
    }).json()
    return msg.channel.send(body.joke)
  }
}
