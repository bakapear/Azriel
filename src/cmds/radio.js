let util = require('../util')
let dp = require('despair')

module.exports = {
  name: 'radio',
  aliases: [],
  description: 'Gets a list of radio stations.',
  permissions: [],
  args: 0,
  usage: '(query) (poker)',
  exec: async (msg, cmd) => {
    let res = await util.poker(getStations, cmd)
    if (!res.items.length) return msg.channel.send('Nothing found!')
    if (res.isList) {
      return util.showEmbedList(msg.channel, res.items, res.offset, items => {
        return {
          title: res.search ? `Listing stations including '${res.search}'` : 'Listing all radio stations',
          description: items.map(x => `[${x.name.trim()}](${x.url_resolved.trim() || x.url.trim()})`).join('\n')
        }
      })
    }
    let item = res.item
    return util.showEmbed(msg.channel, {
      description: `[${item.name.trim()}](${item.url_resolved.trim() || item.url.trim()})`
    })
  }
}

async function getStations (query) {
  let body = await dp('https://de1.api.radio-browser.info/json/stations/search', {
    query: {
      name: query,
      limit: 250
    }
  }).json()
  return body
}
