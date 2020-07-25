let util = require('../util')
let ytt = require('ytt')

module.exports = {
  name: 'playlist',
  aliases: ['ytpl'],
  description: 'Gets a youtube playlist.',
  permissions: [],
  args: 1,
  usage: '<query> (poker)',
  exec: async (msg, cmd) => {
    let res = await util.poker(getPlaylists, cmd)
    if (!res.items.length) return msg.channel.send('Nothing found!')
    if (res.isList) {
      return util.showEmbedList(msg.channel, res.items, res.offset, items => {
        return {
          title: `Listing playlists including '${res.search}'`,
          description: items.map(x => `[${x.title}](https://youtube.com/playlist?list=${x.id})`).join('\n')
        }
      })
    }
    let item = res.item
    return msg.channel.send('https://youtube.com/playlist?list=' + item.id)
  }
}

async function getPlaylists (query) {
  let res = await ytt.query(query, { filter: 'playlist' })
  return res.items
}
