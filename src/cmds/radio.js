let util = require('../util')
let dp = require('despair')

module.exports = {
  name: 'radio',
  aliases: [],
  description: `Gets a list of radio stations.`,
  permissions: [],
  args: 1,
  usage: '<query> (offset)',
  exec: async (msg, cmd) => {
    let res = await util.poker(getStations, cmd, true)
    if (!res.items.length || res.offset < 0) return msg.channel.send('Nothing found!')
    let total = res.items.length
    res.items.splice(0, res.offset)
    if (res.items.length > 15) res.items.length = 15
    util.embed(msg.channel, {
      title: 'Radio Stations',
      description: res.items.map(x => `[${x.name.trim()}](${x.url_resolved.trim() || x.url.trim()})`).join('\n'),
      footer: {
        text: `Showing ${res.items.length} stations (${res.offset} - ${total})`
      }
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
