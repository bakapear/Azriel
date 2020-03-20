module.exports = {
  name: 'say',
  aliases: [],
  description: 'Wait, I didn\'t say that... Or did I?',
  permissions: [],
  args: 1,
  usage: '<message>',
  exec: async (msg, cmd) => {
    return msg.channel.send(cmd.content)
  }
}
