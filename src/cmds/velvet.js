let { util } = require('../mod')
let ph = require('path')

let path = ph.join(__dirname, '..', 'data', 'velvet')

module.exports = {
  name: 'velvet',
  aliases: ['irene', 'seulgi', 'wendy', 'joy', 'yeri'],
  description: 'Get an exclusive super cute Red Velvet picture',
  async exec (msg, cmd) {
    let member = (cmd.name === this.name) ? util.randomItem(this.aliases) : cmd.name

    let data = util.readRandomLine(ph.join(path, member + '.dat')).split('|')

    return util.sendImage(msg, data[1])
  }
}
