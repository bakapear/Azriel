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
    return util.sendImage(msg, item, item)
  }
}

async function searchGoogleImages (query) {
  let q = new URLSearchParams({
    q: query,
    tbm: 'isch',
    hl: 'en',
    safe: 'off'
  })

  let body = await fetch('https://www.google.com/search?' + q.toString(), {
    headers: {
      'User-Agent': 'Mozilla/4.0 (compatible; MSIE 6.0; Symbian OS; SAMSUNG-GT-S5230) Opera 8.65'
    }
  }).then(t => t.text())

  let matches = body.matchAll(/data-oh="(.*?)" data-ou="(.*?)" data-ow="(.*?)"/g)

  let images = []
  for (let match of matches) {
    if (match[2]) images.push(match[2])
  }
  return images
}
