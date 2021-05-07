let { util } = require('../mod')
let dp = require('despair')

module.exports = {
  name: 'fabi',
  description: 'Display fabi',
  async exec (msg, cmd) {
    let body = await dp('https://randomfox.ca/floof').json()
    return util.sendImage(msg, body.image)
  }
}
