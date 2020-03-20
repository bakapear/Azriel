let util = require('../util')

module.exports = {
  name: '8ball',
  aliases: [],
  description: 'Shakes the Magic 8 Ball and tells you your fortune.',
  permissions: [],
  args: 0,
  usage: '',
  exec: async (msg, cmd) => {
    return msg.channel.send(`:8ball: ${util.randomItem(answers)}`)
  }
}

let answers = [
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
