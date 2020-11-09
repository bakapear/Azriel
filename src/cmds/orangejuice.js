let util = require('../util')

module.exports = {
  name: 'orangejuice',
  aliases: ['oj'],
  description: 'Gets a card or character from 100% Orange Juice.',
  permissions: [],
  args: 0,
  usage: '(query) (poker)',
  exec: async (msg, cmd) => {
    let res = await util.poker(getCards, cmd)
    if (!res.items.length) return msg.channel.send('Nothing found!')
    if (res.isList) {
      return util.showEmbedList(msg.channel, res.items, res.offset, items => {
        return {
          title: res.search ? `Listing cards including '${res.search}'` : 'Listing all cards',
          description: items.map(x => `[${x.name}](${x.url})`).join('\n')
        }
      })
    }
    let item = res.item
    let img = await util.attachImages([item.url])
    return msg.channel.send({ files: img })
  }
}

async function getCards (query) {
  let data = require('../data/juice.json')
  query = query.toLowerCase()
  return data.filter(x => x.name.toLowerCase().indexOf(query) >= 0)
}
