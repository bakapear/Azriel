let util = require('../util')
let dp = require('despair')

module.exports = {
  name: 'konachan',
  aliases: ['kona'],
  description: 'Gets a cute post from Konachan.',
  permissions: [],
  args: 0,
  usage: '(tags) (poker)',
  exec: async (msg, cmd) => {
    cmd.args = cmd.args.map(x => {
      if (x === 's' || x === 'safe') x = 'rating:safe'
      if (x === 'q' || x === 'questionable') x = 'rating:questionable'
      if (x === 'e' || x === 'explicit') x = 'rating:explicit'
      return x
    })
    let res = await util.poker(getPosts, cmd)
    if (!res.items.length) return msg.channel.send('Nothing found!')
    let item = res.item
    let webm = false
    if (!await util.checkImage(item.file_url)) {
      if (item.file_url.endsWith('.gif')) webm = true
      else item.file_url = item.sample_url
    }
    if (res.isList) {
      return util.showEmbed(msg.channel, {
        title: item.author,
        url: 'https://konachan.net/post/show/' + item.id,
        image: !webm ? { url: item.file_url } : null,
        timestamp: item.created_at,
        footer: { text: item.rating + ' | ' + util.decodeEntities(item.tags) }
      })
    }
    if (webm) return msg.channel.send(item.file_url)
    let img = await util.attachImages([item.file_url])
    return msg.channel.send({ files: img })
  }
}

async function getPosts (query) {
  try {
    let res = await dp('https://konachan.net/post.json', {
      query: {
        tags: query,
        limit: 250
      }
    }).json()
    return res.filter(x => blacklist.every(y => x.tags.indexOf(y) < 0))
  } catch (e) { return [] }
}

let blacklist = ['scat', 'guro', 'furry', 'astolfo_(fate)', 'diaper', 'twerking']
