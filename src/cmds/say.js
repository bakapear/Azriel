module.exports = {
  name: 'say',
  description: 'Say something as me',
  async exec (msg, cmd) {
    return msg.channel.send(cmd.content)
  }
}
