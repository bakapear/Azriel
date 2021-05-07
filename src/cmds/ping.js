module.exports = [
  {
    name: 'ping',
    async exec (msg, cmd) {
      return msg.channel.send(`Pong! It took **${Date.now() - msg.createdTimestamp}ms**!`)
    }
  },
  {
    name: 'pong',
    async exec (msg, cmd) {
      return msg.channel.send('Ping?')
    }
  }
]
