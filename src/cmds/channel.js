let util = require('../util')
let ytt = require('ytt')

module.exports = {
  name: 'channel',
  aliases: ['ytchan'],
  description: 'Gets a youtube channel.',
  permissions: [],
  args: 1,
  usage: '<query> (poker)',
  exec: async (msg, cmd) => {
    let res = await util.poker(getChannels, cmd)
    if (!res.items.length) return msg.channel.send('Nothing found!')
    if (res.isList) {
      return util.showEmbedList(msg.channel, res.items, res.offset, items => {
        return {
          title: `Listing channels including '${res.search}'`,
          description: items.map(x => `[${x.name}](${x.url})`).join('\n')
        }
      })
    }
    let item = res.item
    return msg.channel.send(item.url)
  }
}

async function getChannels (query) {
  let res = await ytt.query(query, { filter: 'channel' })
  return res.items
}
