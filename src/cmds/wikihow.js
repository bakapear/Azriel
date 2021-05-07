let { util } = require('../mod')
let dp = require('despair')

module.exports = [
  {
    name: 'wikihow',
    aliases: ['wh'],
    description: 'Search for a wikihow article',
    args: 1,
    usage: '<query>',
    async exec (msg, cmd) {
      let res = await searchWH(cmd.content)
      if (!res.length) return msg.channel.send('Nothing found!')

      let item = cmd.random ? util.randomItem(res) : res[0]
      return msg.channel.send(item.url)
    }
  },
  {
    name: 'wikihowimg',
    aliases: ['wikimg', 'whimg'],
    description: 'Get a random wikihow image',
    args: 0,
    usage: '(showTitle)',
    async exec (msg, cmd) {
      let res = await randomWHImage()
      if (!res) return msg.channel.send('Nothing found!')
      if (['1', 'yes', 'true', 'on'].includes(cmd.args[0])) {
        return msg.channel.send({
          embed: {
            title: res.title,
            image: { url: res.url }
          }
        })
      }
      return util.sendImage(msg, res.url)
    }
  }
]

async function searchWH (query) {
  let body = await dp('https://www.wikihow.com/api.php', {
    query: {
      format: 'json',
      action: 'titlesearch',
      safeSearch: 0,
      q: query
    }
  }).json()
  return body.data
}

async function randomWHImage () {
  let body = await dp('https://www.wikihow.com/api.php', {
    query: {
      format: 'json',
      action: 'query',
      generator: 'random',
      prop: 'imageinfo',
      grnnamespace: 6,
      iiprop: 'url'
    }
  }).json()
  body = Object.values(body.query.pages)[0]
  if (!body) return null
  let title = body.title.slice(6, -4)
  let step = title.lastIndexOf('Step')
  if (step >= 0) title = title.substr(0, step)
  return {
    title: title,
    url: body.imageinfo[0].url
  }
}
