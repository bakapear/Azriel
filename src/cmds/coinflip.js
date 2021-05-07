module.exports = {
  name: 'coinflip',
  aliases: ['coin', 'toss'],
  description: 'Flip a coin',
  async exec (msg, cmd) {
    return msg.channel.send(`It's **${Math.random() < 0.5 ? 'Heads' : 'Tails'}**!`)
  }
}
