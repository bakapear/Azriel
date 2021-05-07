let dp = require('despair')

module.exports = {
  name: 'chucknorris',
  aliases: ['chuck', 'norris'],
  description: 'Tell a random chuck norris joke',
  async exec (msg, cmd) {
    let body = await dp('https://api.chucknorris.io/jokes/random').json()
    return msg.channel.send(body.value)
  }
}
