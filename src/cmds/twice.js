let { util } = require('../mod')
let ph = require('path')

let path = ph.join(__dirname, '..', 'data', 'twice')

module.exports = {
  name: 'twice',
  aliases: ['TWICE', 'nayeon', 'jeongyeon', 'momo', 'sana', 'jihyo', 'mina', 'dahyun', 'chaeyoung', 'tzuyu'],
  description: 'Get an exclusive super cute TWICE picture',
  async exec (msg, cmd) {
    let list = this.aliases.slice(2)
    let member = list.includes(cmd.name) ? cmd.name : util.randomItem(list)

    let data = util.readRandomLine(ph.join(path, member + '.dat')).split('|')

    return util.sendImage(msg, data[1])
  }
}
