let { util } = require('../mod')
let dp = require('despair')

module.exports = {
  name: 'pr0gramm',
  aliases: ['pr0'],
  description: 'Get a random pr0gramm post',
  async exec (msg, cmd) {
    let body = await dp('http://pr0gramm.com/api/items/get',
      { headers: { 'user-agent': 'joker' } }
    ).json()
    let item = util.randomItem(body.items)

    let url = 'https://img.pr0gramm.com/' + item.image
    if (url.endsWith('.mp4')) return msg.channel.send(url)

    return util.sendImage(msg, url)
  }
}
