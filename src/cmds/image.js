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
    headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/406.0.862495628 Mobile/15E148 Safari/604.1' },
    query: {
      q: query,
      tbm: 'isch',
      hl: 'en',
      safe: 'off',
      asearch: 'isch',
      async: '_fmt:json,p:1,ijn:0'
    }
  }).text() 

  body = JSON.parse(body.slice(4)).ischj.metadata

  let items = []

  for (let item of body) {
    items.push({
        o: {
          u: item.original_image.url,
          w: item.original_image.width,
          h: item.original_image.height
        },
        t: {
          u: item.thumbnail.url,
          w: item.thumbnail.width,
          h: item.thumbnail.height
        }
      })
  }

  return items
}
