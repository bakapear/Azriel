let { util } = require('../mod')

module.exports = {
  name: '8ball',
  description: 'Shake the Magic 8 Ball to hear about your fortune',
  async exec (msg, cmd) {
    return msg.channel.send(`:8ball: ${util.randomItem(ANSWERS)}`)
  }
}

let ANSWERS = [
  'It is certain',
  'It is decidedly so',
  'Without a doubt',
  'Yes definitely',
  'You may rely on it',
  'As I see it, yes',
  'Most likely',
  'Outlook good',
  'Yes',
  'Signs point to yes',
  'Reply hazy try again',
  'Ask again later',
  'Better not tell you now',
  'Cannot predict now',
  'Concentrate and ask again',
  "Don't count on it",
  'My reply is no',
  'Outlook not so good',
  'Very doubtful'
]
