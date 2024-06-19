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
      udm: 2,
      asearch: 'arc',
      hl: 'en',
      safe: 'off',
      async: '_fmt:pc',
      q: query
    }
  }).text()

  body = JSON.parse(body.slice(body.indexOf(';[[[') + 1))[0]

  let items = []

  for (let item of body) {
    item = JSON.parse(item[1])
    if (item[0] === 1 && Array.isArray(item[1])) {
      items.push({
        o: {
          u: item[1][3][0],
          w: item[1][3][1],
          h: item[1][3][2]
        },
        t: {
          u: item[1][2][0],
          w: item[1][2][1],
          h: item[1][2][2]
        }
      })
    }
  }

  return items
}
