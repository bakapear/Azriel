let util = require('../util')
let dp = require('despair')

module.exports = {
  name: 'image',
  aliases: ['i', 'img'],
  description: 'Gets an image on Google.',
  permissions: [],
  args: 1,
  usage: '<query> (poker)',
  exec: async (msg, cmd) => {
    let res = await util.poker(getImages, cmd)
    if (!res.items.length) return msg.channel.send('Nothing found!')
    if (res.isList) {
      return util.showEmbedList(msg.channel, res.items, res.offset, items => {
        return {
          title: `Listing images including '${res.search}'`,
          description: items.map(x => `${x.o.u}`).join('\n')
        }
      })
    }
    let item = res.item
    let url = await head(item.o.u) ? item.o.u : item.t.u
    let img = await util.attachImages([url])
    return msg.channel.send({ files: img })
  }
}

async function getImages (query) {
  let { body } = await dp('https://www.google.com/search', {
    headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux i686; rv:64.0) Gecko/20100101 Firefox/64.0' },
    query: {
      source: 'lnms',
      tbm: 'isch',
      sa: 'X',
      hl: 'en',
      safe: 'off',
      q: query
    }
  })
  let result = []
  let start = body.indexOf('function(){return [', body.indexOf("key: 'ds:1'")) + 18
  let end = body.indexOf('}});</script>', start) - 1
  let json = null
  try {
    json = JSON.parse(body.substring(start, end))[31][0][12][2]
  } catch (e) { return [] }
  for (let i = 0; i < json.length; i++) {
    let data = json[i][1]
    if (!data) continue
    let item = {
      o: {
        u: data[3][0],
        w: data[3][2],
        h: data[3][1]
      },
      t: {
        u: data[2][0],
        w: data[2][2],
        h: data[2][1]
      }
    }
    result.push(item)
  }
  return result
}

async function head (url) {
  let res = await dp.head(url).catch(e => e)
  if ((res.statusCode || res.code) <= 200) {
    let size = Number(res.headers['content-length'] || '0')
    let type = res.headers['content-type'] || ''
    return size <= 8000000 && size > 0 && type.indexOf('image') >= 0 && type.indexOf('svg') < 0
  }
}
