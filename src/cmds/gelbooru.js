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
    let webm = item.image.endsWith('.webm')
    if (res.isList) {
      if (webm) msg.channel.send(item.file_url)
      return util.showEmbed(msg.channel, {
        title: item.owner,
        url: 'https://gelbooru.com/index.php?page=post&s=view&id=' + item.id,
        image: !webm ? { url: item.file_url } : null,
        timestamp: item.created_at,
        footer: { text: item.rating + ' | ' + item.tags }
      })
    }
    if (webm) {
      return msg.channel.send(item.file_url)
    } else {
      let img = await util.attachImages([item.file_url])
      return msg.channel.send({ files: img })
    }
  }
}

async function getPosts (query) {
  try {
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
  } catch (e) { return [] }
}
