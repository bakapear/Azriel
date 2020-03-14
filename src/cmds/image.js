let util = require('../util')
let dp = require('despair')

module.exports = {
  name: 'image',
  aliases: ['i', 'img'],
  description: `Gets an image on Google.`,
  permissions: [],
  args: 1,
  usage: '<query> (offset)',
  exec: async (msg, cmd) => {
    let res = await util.poker(getImages, cmd)
    if (!res) return msg.channel.send('Nothing found!')
    let img = await util.attachImages([res.o.u])
    msg.channel.send({ files: img })
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
  if (!result.length) require('fs').writeFileSync('test.html', body)
  return result
    .filter(x => x.o.u.indexOf('fbsbx.com/') < 0 && !x.o.u.endsWith('.svg'))
}
