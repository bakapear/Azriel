let dp = require('despair')
let { util } = require('../mod')

module.exports = {
  name: 'coub',
  description: 'Query for coub video',
  args: 1,
  usage: '<query>',
  async exec (msg, cmd) {
    let res = await dp('https://coub.com/api/v2/smart_search/general_search?per_page=50&search_query=' + encodeURIComponent(cmd.content)).json().catch(() => null)
    if (!res || !res.coubs.length) return msg.channel.send('Nothing found!')

    let i = cmd.random ? Math.floor(Math.random() * res.coubs.length) : 0
    // return msg.channel.send(res.coubs[i].file_versions.share.default)
    return util.sendImage(msg, res.coubs[i].file_versions.share.default)
  }
}
