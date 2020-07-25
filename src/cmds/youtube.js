let util = require('../util')
let ytt = require('ytt')

module.exports = {
  name: 'youtube',
  aliases: ['yt', 'ytvid'],
  description: 'Gets a youtube video.',
  permissions: [],
  args: 1,
  usage: '<query> (poker)',
  exec: async (msg, cmd) => {
    let res = await util.poker(getVideos, cmd)
    if (!res.items.length) return msg.channel.send('Nothing found!')
    if (res.isList) {
      return util.showEmbedList(msg.channel, res.items, res.offset, items => {
        return {
          title: `Listing videos including '${res.search}'`,
          description: items.map(x => `[${x.title}](https://youtube.com/watch?v=${x.id})`).join('\n')
        }
      })
    }
    let item = res.item
    return msg.channel.send('https://youtube.com/watch?v=' + item.id)
  }
}

async function getVideos (query) {
  let res = await ytt.query(query, { filter: 'video' })
  return res.items
}
