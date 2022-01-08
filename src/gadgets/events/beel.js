/* global bot */
let dp = require('despair')
let { util } = require('../../mod')

let channel = bot.channels.cache.get('402461425743822879')
if (channel) setTimer(() => util.getToTime(13))

function setTimer (fn) {
  setTimeout(async () => {
    try {
      let urls = await getKPOP()
      channel.send({ content: '<@284425943034888204>, ' + (urls[0] || 'woof') })
      setTimer(fn)
    } catch (e) { console.error(e) }
  }, fn())
}

async function getKPOP (limit = 25) {
  let body = await dp('https://www.reddit.com/r/kpopfap/new.json', { query: { limit } }).json()
  body = body.data.children
  let res = []
  for (let i = 0; i < body.length; i++) {
    let item = body[i].data
    if (['reddit.com', 'i.redd.it', 'gfycat.com', 'i.imgur.com'].includes(item.domain)) {
      if (item.secure_media) {
        if (item.domain === 'gfycat.com') item = item.url + '.gif'
        else item = item.secure_media.oembed.thumbnail_url
      } else if (item.media_metadata) {
        let data = Object.values(item.media_metadata).find(x => x.status === 'valid')
        item = 'https://i.redd.it/' + data.id + '.' + data.m.split('/').pop()
      } else {
        item = item.url
      }
      res.push(item)
    }
  }
  return res
}
