module.exports = {
  name: 'coinflip',
  aliases: ['coin', 'toss'],
  description: 'Flips a coin.',
  permissions: [],
  args: 0,
  usage: '',
  exec: async (msg, cmd) => {
    msg.channel.send(`It's **${Math.random() < 0.5 ? 'Heads' : 'Tails'}**!`)
  }
}
