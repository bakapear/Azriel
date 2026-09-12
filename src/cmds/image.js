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

  let body = await fetch('https://www.google.com/wml/search?' + q.toString(), {
    headers: {
      'User-Agent': 'Nokia7610/2.0 (5.0509.0) SymbianOS/7.0s Series60/2.1 Profile/MIDP-2.0 Configuration/CLDC-1.0'
    }
  }).then(t => t.text())

  let matches = body.matchAll(/imgres\?imgurl=(.*?)&amp;imgrefurl/g)

  let images = []
  for (let match of matches) images.push(match[1])
  return images
}
