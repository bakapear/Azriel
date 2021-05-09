let { util } = require('../mod')
let ph = require('path')

let path = ph.join(__dirname, '..', 'data', 'velvet')

module.exports = {
  name: 'velvet',
  aliases: ['redvelvet', 'rv', 'irene', 'seulgi', 'wendy', 'joy', 'yeri'],
  description: 'Get an exclusive super cute Red Velvet picture',
  async exec (msg, cmd) {
    let list = this.aliases.slice(2)
    let member = list.includes(cmd.name) ? cmd.name : util.randomItem(list)

    let data = util.readRandomLine(ph.join(path, member + '.dat')).split('|')

    return util.sendImage(msg, data[1])
  }
}
