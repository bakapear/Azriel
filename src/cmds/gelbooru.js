let util = require('../util')
let dp = require('despair')

module.exports = {
  name: 'gelbooru',
  aliases: ['gel'],
  description: 'Gets a naughty post from Gelbooru.',
  permissions: [],
  args: 0,
  usage: '(tags) (poker)',
  exec: async (msg, cmd) => {
    let res = await util.poker(getPosts, cmd)
    if (!res.items.length) return msg.channel.send('Nothing found!')
    let item = res.item
    if (res.isList) {
      return util.showEmbed(msg.channel, {
        image: { url: item.file_url },
        timestamp: item.created_at,
        footer: { text: item.rating + ' | ' + item.tags }
      })
    }
    let img = await util.attachImages([item.file_url])
    return msg.channel.send({ files: img })
  }
}

async function getPosts (query) {
  let res = await dp('https://gelbooru.com/index.php', {
    query: {
      tags: query,
      page: 'dapi',
      s: 'post',
      q: 'index',
      limit: 250,
      json: 1
    }
  }).json()
  return res.filter(x =>
    x.tags.indexOf('scat') < 0 &&
    x.tags.indexOf('guro') < 0 &&
    x.tags.indexOf('furry') < 0 &&
    x.tags.indexOf('astolfo_(fate)') < 0)
}
