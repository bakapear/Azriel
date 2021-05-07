let { util } = require('../mod')

module.exports = {
  name: 'waifu',
  description: 'Display a waifu that does not exist',
  async exec (msg, cmd) {
    let rnd = util.randomInt(0, 100000)
    let url = `https://www.thiswaifudoesnotexist.net/example-${rnd}.jpg`
    return util.sendImage(msg, url)
  }
}
