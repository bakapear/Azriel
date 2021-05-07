let { util } = require('../mod')
let dp = require('despair')

module.exports = {
  name: 'trump',
  description: 'Print or append a trump quote',
  usage: '(something)',
  async exec (msg, cmd) {
    let body = await dp('https://api.whatdoestrumpthink.com/api/v1/quotes').json()
    if (cmd.content) {
      return msg.channel.send(`${cmd.content} ${util.randomItem(body.messages.personalized)}`)
    } else {
      return msg.channel.send(util.randomItem(body.messages.non_personalized))
    }
  }
}
