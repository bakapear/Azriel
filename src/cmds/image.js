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
    headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/399.2.845414227 Mobile/15E148 Safari/604.1' },
    query: {
      udm: 2,
      asearch: 'arc',
      hl: 'en',
      safe: 'off',
      async: 'arc_id:srp_zF_JZ_ehGr-L7M8Po-jhgQE_100,use_ac:true,_fmt:pc',
      q: query
    }
  }).text()

  let start = body.indexOf(';[[[') + 1
  let end = body.indexOf("c;", start)
  body = JSON.parse(body.substr(start, end - start))[0]

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
