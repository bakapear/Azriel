let ytt = require('ytt')
let { util } = require('../mod')

module.exports = [
  {
    name: 'youtube',
    aliases: ['yt', 'ytvid'],
    description: 'Search for a YouTube video',
    args: 1,
    usage: '<query>',
    async exec (msg, cmd) {
      let res = await ytt.query(cmd.content, { filter: 'video' })
      if (!res.items.length) return msg.channel.send('Nothing found!')

      let item = cmd.random ? util.randomItem(res.items) : res.items[0]
      return msg.channel.send('https://youtube.com/watch?v=' + item.id)
    }
  },
  {
    name: 'ytchannel',
    aliases: ['ytchan'],
    description: 'Search for a YouTube channel',
    args: 1,
    usage: '<query>',
    async exec (msg, cmd) {
      let res = await ytt.query(cmd.content, { filter: 'channel' })
      if (!res.items.length) return msg.channel.send('Nothing found!')

      let item = await ytt.channel(res.items[0].id)

      let stats = Object.entries(item.stats)
      let date = stats.splice(stats.findIndex(x => x[0] === 'date'), 1)[0][1]
      return msg.channel.send({
        embed: {
          title: item.title,
          url: 'https://youtube.com/channel/' + item.id,
          description: util.limit(item.description, 200),
          thumbnail: { url: item.thumbnail.url },
          footer: {
            text: date + ' · ' + stats.map(x => util.stat(x[1], x[0])).join(' · ')
          },
          image: {
            url: item.banner ? (item.banner.url + '=w1138-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj') : null
          }
        }
      })
    }
  },
  {
    name: 'ytplaylist',
    aliases: ['ytpl'],
    description: 'Search for a YouTube playlist',
    args: 1,
    usage: '<query>',
    async exec (msg, cmd) {
      let res = await ytt.query(cmd.content, { filter: 'playlist' })
      if (!res.items.length) return msg.channel.send('Nothing found!')

      let item = await ytt.playlist(res.items[0].id)

      let stats = Object.entries(item.stats)
      return msg.channel.send({
        embed: {
          author: {
            icon_url: item.author.thumbnail.url,
            name: item.author.title,
            url: 'https://youtube.com/channel/' + item.author.id
          },
          title: item.title,
          url: 'https://youtube.com/playlist?list=' + item.id,
          description: util.limit(item.description, 200),
          thumbnail: { url: item.thumbnail.url },
          footer: {
            text: stats.map(x => util.stat(x[1], x[0])).join(' · ')
          }
        }
      })
    }
  }
]
