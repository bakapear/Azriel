let { util } = require('../mod')
let dp = require('despair')

module.exports = {
  name: 'image',
  aliases: ['i', 'img'],
  description: 'Get a Google image result',
  args: 1,
  usage: '<query>',
  async exec (msg, cmd) {
    let res = await searchGoogleImages(cmd.content)
    if (!res.length) return msg.channel.send('Nothing found!')

    let item = cmd.random ? util.randomItem(res) : res[0]
    return util.sendImage(msg, item.o.u, item.t.u)
  }
}

async function searchGoogleImages (query) {
  let body = await dp('https://www.google.com/search', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36' },
    query: {
      source: 'lnms',
      tbm: 'isch',
      sa: 'X',
      hl: 'en',
      safe: 'off',
      q: query
    }
  }).text()
  let result = []
  let start = body.indexOf('data:', body.indexOf("ds:1',")) + 5
  let end = body.indexOf(', sideChannel: {', start)
  let json = null
  let alt = false
  try {
    json = JSON.parse(body.substring(start, end))[31]
    json = json[json.length - 1][12][2]
  } catch (e) {
    try {
      alt = true
      json = JSON.parse(body.substring(start, end))[56][1][0]
      json = json[json.length - 1][1][0]
    } catch (e) { return [] }
  }
  for (let i = 0; i < json.length; i++) {
    let data = alt ? json[i][0][0]['444383007'][1] : json[i][1]
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
