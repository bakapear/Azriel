let dp = require('despair')
let { util } = require('../mod')

module.exports = {
  name: 'coub',
  description: 'Query for coub video',
  args: 1,
  usage: '<query>',
  async exec (msg, cmd) {
    let res = await dp('https://coub.com/api/v2/smart_search/general_search?per_page=50&search_query=' + encodeURIComponent(cmd.content)).json().catch(() => null)

    let coubs = res?.coubs.filter(x => x?.file_versions?.share?.default)

    if (!res || !coubs.length) return msg.channel.send('Nothing found!')

    let i = cmd.random ? Math.floor(Math.random() * coubs.length) : 0

    return util.sendImage(msg, coubs[i].file_versions.share.default)
  }
}
